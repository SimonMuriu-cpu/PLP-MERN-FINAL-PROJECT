const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const { city, search } = req.query;
    
    let query = { role: 'vendor', isActive: true };
    
    if (city) {
      query.city = city;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const vendors = await User.find(query, 'name email phone address city createdAt');
    
    // Get product count for each vendor
    const vendorsWithStats = await Promise.all(
      vendors.map(async (vendor) => {
        const productCount = await Product.countDocuments({ 
          vendor: vendor._id, 
          isActive: true 
        });
        
        return {
          ...vendor.toObject(),
          productCount,
          rating: 4 + Math.random(), // Mock rating for demo
          reviewCount: Math.floor(Math.random() * 50) + 1 // Mock review count
        };
      })
    );

    res.json(vendorsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single vendor
router.get('/:id', async (req, res) => {
  try {
    const vendor = await User.findOne({ 
      _id: req.params.id, 
      role: 'vendor', 
      isActive: true 
    }, 'name email phone address city createdAt');
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const productCount = await Product.countDocuments({ 
      vendor: vendor._id, 
      isActive: true 
    });

    const vendorWithStats = {
      ...vendor.toObject(),
      productCount,
      rating: 4 + Math.random(), // Mock rating for demo
      reviewCount: Math.floor(Math.random() * 50) + 1 // Mock review count
    };

    res.json(vendorWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;