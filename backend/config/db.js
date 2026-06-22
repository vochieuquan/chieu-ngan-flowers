const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chieu_ngan_flower');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Auto seeding check
    const User = require('../models/User');
    const Product = require('../models/Product');
    const { mockProducts } = require('../seed');

    const adminCount = await User.countDocuments();
    if (adminCount === 0) {
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const admin = new User({
        username: adminUsername,
        password: adminPassword,
      });
      await admin.save();
      console.log(`[Auto-Seed] Created default admin account (Username: ${adminUsername})`);
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0 && mockProducts && mockProducts.length > 0) {
      await Product.insertMany(mockProducts);
      console.log(`[Auto-Seed] Inserted ${mockProducts.length} default products.`);
    }
  } catch (error) {
    console.error(`Database connection or seeding error: ${error.message}`);
    process.exit(1);
  }
};


module.exports = connectDB;
