const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localmart', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    console.log('Cleared existing data');

    // Create demo users
    const demoUsers = [
      {
        name: 'Demo Customer',
        email: 'customer@demo.com',
        password: await bcrypt.hash('password', 10),
        role: 'customer',
        phone: '+254700000001',
        address: '123 Demo Street, Nairobi',
        city: 'Nairobi'
      },
      {
        name: 'Demo Vendor',
        email: 'vendor@demo.com',
        password: await bcrypt.hash('password', 10),
        role: 'vendor',
        phone: '+254700000002',
        address: '456 Market Street, Nairobi',
        city: 'Nairobi'
      },
      {
        name: 'Fresh Fruits Kenya',
        email: 'freshfruits@demo.com',
        password: await bcrypt.hash('password', 10),
        role: 'vendor',
        phone: '+254700000003',
        address: '789 Fruit Avenue, Eldoret',
        city: 'Eldoret'
      },
      {
        name: 'Electronics Hub',
        email: 'electronics@demo.com',
        password: await bcrypt.hash('password', 10),
        role: 'vendor',
        phone: '+254700000004',
        address: '321 Tech Road, Mombasa',
        city: 'Mombasa'
      }
    ];

    const createdUsers = await User.insertMany(demoUsers);
    console.log('Created demo users');

    // Get vendors
    const vendors = createdUsers.filter(user => user.role === 'vendor');

    // Create demo products
    const demoProducts = [
      {
        name: 'Fresh Bananas',
        description: 'Sweet and ripe bananas from local farms',
        price: 150,
        category: 'Fruits',
        stock: 50,
        vendor: vendors[0]._id,
        image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Red Apples',
        description: 'Crisp and juicy red apples',
        price: 200,
        category: 'Fruits',
        stock: 30,
        vendor: vendors[0]._id,
        image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Organic Tomatoes',
        description: 'Fresh organic tomatoes grown locally',
        price: 120,
        category: 'Vegetables',
        stock: 25,
        vendor: vendors[1]._id,
        image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Smartphone',
        description: 'Latest Android smartphone with great features',
        price: 25000,
        category: 'Electronics',
        stock: 10,
        vendor: vendors[2]._id,
        image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 3500,
        category: 'Electronics',
        stock: 15,
        vendor: vendors[2]._id,
        image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Fresh Milk',
        description: 'Fresh cow milk from local dairy farms',
        price: 80,
        category: 'Dairy',
        stock: 40,
        vendor: vendors[1]._id,
        image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Whole Wheat Bread',
        description: 'Freshly baked whole wheat bread',
        price: 60,
        category: 'Bakery',
        stock: 20,
        vendor: vendors[0]._id,
        image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Green Vegetables Mix',
        description: 'Fresh mixed green vegetables',
        price: 180,
        category: 'Vegetables',
        stock: 35,
        vendor: vendors[1]._id,
        image: 'https://images.pexels.com/photos/1400172/pexels-photo-1400172.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    ];

    await Product.insertMany(demoProducts);
    console.log('Created demo products');

    console.log('Seed data created successfully!');
    console.log('\nDemo accounts:');
    console.log('Customer: customer@demo.com / password');
    console.log('Vendor: vendor@demo.com / password');
    console.log('Vendor 2: freshfruits@demo.com / password');
    console.log('Vendor 3: electronics@demo.com / password');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();