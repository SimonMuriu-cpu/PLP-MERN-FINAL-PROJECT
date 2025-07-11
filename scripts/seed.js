const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localmart', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample data
const users = [
  {
    name: 'John Customer',
    email: 'customer@demo.com',
    password: 'password',
    role: 'customer',
    phone: '555-0101',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    }
  },
  {
    name: 'Jane Vendor',
    email: 'vendor@demo.com',
    password: 'password',
    role: 'vendor',
    phone: '555-0102',
    businessName: 'Jane\'s Electronics',
    businessDescription: 'Quality electronics and gadgets',
    address: {
      street: '456 Business Ave',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    }
  },
  {
    name: 'Fresh Fruits Co',
    email: 'freshfruits@demo.com',
    password: 'password',
    role: 'vendor',
    phone: '555-0103',
    businessName: 'Fresh Fruits Market',
    businessDescription: 'Fresh organic fruits and vegetables',
    address: {
      street: '789 Market St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    }
  },
  {
    name: 'Tech Store',
    email: 'electronics@demo.com',
    password: 'password',
    role: 'vendor',
    phone: '555-0104',
    businessName: 'Tech Store Plus',
    businessDescription: 'Latest technology and electronics',
    address: {
      street: '321 Tech Blvd',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    }
  }
];

const products = [
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced camera system and A17 Pro chip',
    price: 999.99,
    category: 'Electronics',
    images: [{
      url: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      public_id: 'sample_iphone'
    }],
    stock: 25,
    tags: ['smartphone', 'apple', 'mobile']
  },
  {
    name: 'Samsung Galaxy S24',
    description: 'Powerful Android smartphone with excellent display',
    price: 899.99,
    category: 'Electronics',
    images: [{
      url: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
      public_id: 'sample_samsung'
    }],
    stock: 30,
    tags: ['smartphone', 'samsung', 'android']
  },
  {
    name: 'Organic Apples',
    description: 'Fresh organic apples from local farms',
    price: 4.99,
    category: 'Food & Beverages',
    images: [{
      url: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg',
      public_id: 'sample_apples'
    }],
    stock: 100,
    tags: ['organic', 'fruit', 'healthy']
  },
  {
    name: 'Fresh Bananas',
    description: 'Ripe yellow bananas perfect for snacking',
    price: 2.99,
    category: 'Food & Beverages',
    images: [{
      url: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg',
      public_id: 'sample_bananas'
    }],
    stock: 150,
    tags: ['fruit', 'healthy', 'potassium']
  },
  {
    name: 'MacBook Pro 16"',
    description: 'Professional laptop with M3 Pro chip for demanding tasks',
    price: 2499.99,
    category: 'Electronics',
    images: [{
      url: 'https://images.pexels.com/photos/18105/pexels-photo.jpg',
      public_id: 'sample_macbook'
    }],
    stock: 15,
    tags: ['laptop', 'apple', 'professional']
  },
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones',
    price: 299.99,
    category: 'Electronics',
    images: [{
      url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
      public_id: 'sample_headphones'
    }],
    stock: 40,
    tags: ['audio', 'wireless', 'noise-cancelling']
  }
];

// Seed function
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.create(users);
    console.log('Users created');

    // Get vendor IDs
    const vendors = createdUsers.filter(user => user.role === 'vendor');
    
    // Assign products to vendors
    const productsWithVendors = products.map((product, index) => ({
      ...product,
      vendor: vendors[index % vendors.length]._id
    }));

    // Create products
    await Product.create(productsWithVendors);
    console.log('Products created');

    console.log('Database seeded successfully!');
    console.log('\nDemo accounts:');
    console.log('Customer: customer@demo.com / password');
    console.log('Vendor: vendor@demo.com / password');
    console.log('Vendor 2: freshfruits@demo.com / password');
    console.log('Vendor 3: electronics@demo.com / password');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder
const runSeeder = async () => {
  await connectDB();
  await seedData();
};

runSeeder();