import { useState, useEffect } from 'react';
import { formatCurrency, formatDate, getOrderStatusColor } from '../utils/formatters';
import { CheckCircleIcon, TruckIcon, PackageIcon, ClockIcon } from '@heroicons/react/24/outline';
import api from '../utils/api';
import toast from 'react-hot-toast';

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/vendor/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/vendor/orders/${orderId}/status`, { status: newStatus });
      
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5" />;
      case 'packaging':
        return <PackageIcon className="h-5 w-5" />;
      case 'in transit':
        return <TruckIcon className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'pending': 'packaging',
      'packaging': 'in transit',
      'in transit': 'delivered'
    };
    return statusFlow[currentStatus];
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Mark as Packaging',
      'packaging': 'Mark as In Transit',
      'in transit': 'Mark as Delivered'
    };
    return labels[status];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-2">Manage and track your customer orders</p>
      </div>

      {/* Filter tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { key: 'all', label: 'All Orders' },
              { key: 'pending', label: 'Pending' },
              { key: 'packaging', label: 'Packaging' },
              { key: 'in transit', label: 'In Transit' },
              { key: 'delivered', label: 'Delivered' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
          </h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? 'Orders will appear here once customers start purchasing your products.'
              : `Orders with ${filter} status will appear here.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Customer: {order.customer.name} • {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                    <span className="text-lg font-semibold text-primary-600">
                      {formatCurrency(order.totalAmount)}
                    </span>
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <button
                        onClick={() => updateOrderStatus(order._id, getNextStatus(order.status))}
                        className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
                      >
                        {getStatusLabel(order.status)}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <img
                            src={item.product.image || 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=200'}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity} × {formatCurrency(item.price)}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Delivery Information</h4>
                    <div className="bg-gray-50 rounded-md p-4">
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Customer:</span> {order.customer.name}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Phone:</span> {order.deliveryAddress.phone}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Address:</span> {order.deliveryAddress.street}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">City:</span> {order.deliveryAddress.city}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {order.status === 'pending' && (
                  <div className="mt-6 p-4 bg-yellow-50 rounded-md">
                    <div className="flex">
                      <ClockIcon className="h-5 w-5 text-yellow-400 mr-2" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">
                          Action Required
                        </h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          This order is pending. Start packaging the items and update the status.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;