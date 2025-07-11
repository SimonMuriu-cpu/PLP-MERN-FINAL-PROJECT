import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/formatters';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, getTotalPrice, getItemsByVendor, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: user?.city || '',
    phone: user?.phone || ''
  });

  const vendorGroups = getItemsByVendor();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryAddress,
        totalAmount: getTotalPrice()
      };

      await api.post('/orders', orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
            
            {vendorGroups.map((group, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900">{group.vendor.name}</h4>
                  <span className="text-sm text-gray-500">{group.vendor.city}</span>
                </div>
                
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <div key={item._id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <span className="text-sm text-gray-900">{item.name}</span>
                        <span className="text-sm text-gray-500 ml-2">x {item.quantity}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 pt-3 border-t flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Subtotal</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(group.total)}
                  </span>
                </div>
              </div>
            ))}
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary-600">{formatCurrency(getTotalPrice())}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Delivery Information */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Information</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="form-input bg-gray-50"
                />
              </div>
              
              <div>
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  value={deliveryAddress.phone}
                  onChange={(e) => setDeliveryAddress({...deliveryAddress, phone: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  value={deliveryAddress.street}
                  onChange={(e) => setDeliveryAddress({...deliveryAddress, street: e.target.value})}
                  className="form-input"
                  placeholder="Street address"
                  required
                />
              </div>
              
              <div>
                <label className="form-label">City</label>
                <input
                  type="text"
                  value={deliveryAddress.city}
                  onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 mt-6">
                <h4 className="font-medium text-green-800 mb-2">Same-Day Delivery</h4>
                <p className="text-sm text-green-700">
                  Your order will be delivered today by the respective vendors. 
                  You'll receive updates on your order status.
                </p>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-md font-medium hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;