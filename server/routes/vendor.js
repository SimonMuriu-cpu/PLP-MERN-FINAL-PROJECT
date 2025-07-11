const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, vendorAuth } = require('../middleware/auth');

const router = express.Router();

// Get vendor stats
router.get('/stats', [auth, vendorAuth], async (req, res) => {
  try {
    const vendorId = req.user._id;

    // Get total products
    const totalProducts = await Product.countDocuments({ vendor: vendorId, isActive: true });

    // Get orders containing vendor's products
    const orders = await Order.find({
      'items.product': { $in: await Product.find({ vendor: vendorId }).distinct('_id') }
    });

    // Calculate stats
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
      const vendorItems = order.items.filter(item => 
        item.product && item.product.vendor && item.product.vendor.toString() === vendorId.toString()
      );
      return sum + vendorItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
    }, 0);

    const pendingOrders = orders.filter(order => order.status === 'pending').length;

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get vendor orders
router.get('/orders', [auth, vendorAuth], async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const vendorId = req.user._id;

    // Get vendor's products
    const vendorProducts = await Product.find({ vendor: vendorId }).select('_id');
    const productIds = vendorProducts.map(p => p._id);

    // Find orders containing vendor's products
    const orders = await Order.find({
      'items.product': { $in: productIds }
    })
    .populate('customer', 'name phone')
    .populate('items.product', 'name vendor')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    // Filter and process orders
    const processedOrders = orders.map(order => {
      const vendorItems = order.items.filter(item => 
        item.product && item.product.vendor && item.product.vendor.toString() === vendorId.toString()
      );
      
      const vendorTotal = vendorItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...order.toObject(),
        items: vendorItems,
        totalAmount: vendorTotal
      };
    }).filter(order => order.items.length > 0);

    res.json(processedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get vendor products
router.get('/products', [auth, vendorAuth], async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    
    const products = await Product.find({ vendor: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.patch('/orders/:id/status', [auth, vendorAuth], async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'packaging', 'in transit', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id)
      .populate('items.product', 'vendor')
      .populate('customer', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if vendor has products in this order
    const hasVendorProducts = order.items.some(item => 
      item.product && item.product.vendor && item.product.vendor.toString() === req.user._id.toString()
    );

    if (!hasVendorProducts) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Update order status
    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date()
    });

    await order.save();

    // Notify customer via socket
    const io = req.app.get('io');
    io.to(order.customer._id.toString()).emit('orderStatusUpdated', {
      orderId: order._id,
      status,
      customerName: order.customer.name
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;