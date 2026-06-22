const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

const mockProducts = [
  {
    name: 'Bó Hoa Hồng Đỏ Nhập Khẩu "Eternity"',
    description: 'Bó hoa hồng đỏ Ecuador nhập khẩu kết hợp với lá phụ cao cấp. Thể hiện tình yêu nồng cháy, vĩnh cửu và sự lãng mạn tinh tế.',
    price: 1200000,
    salePrice: 990000,
    category: 'Hoa bó kỉ yếu, sinh nhật',
    images: ['https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
    featured: true,
  },
  {
    name: 'Bó Hoa Tulip Trắng Tinh Khôi',
    description: 'Bó hoa tulip Hà Lan trắng mang vẻ đẹp thanh khiết, trang nhã. Phù hợp làm quà tặng sinh nhật hoặc kỷ niệm ngày cưới.',
    price: 1500000,
    salePrice: null,
    category: 'Hoa bó kỉ yếu, sinh nhật',
    images: ['https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
    featured: true,
  },
  {
    name: 'Giỏ Trái Cây Nhập Khẩu Quà Tặng Cao Cấp',
    description: 'Giỏ quả cao cấp kết hợp táo Envy, nho mẫu đơn xanh Nhật Bản, lê Hàn Quốc cùng hoa tươi trang trí sang trọng. Quà tặng kính lễ hoặc đối tác lịch sự.',
    price: 1500000,
    salePrice: 1200000,
    category: 'Giỏ trái cây',
    images: ['https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
    featured: true,
  },
  {
    name: 'Hộp Hoa Hồng Sáp Thơm "Luxury Red"',
    description: 'Hộp quà hoa hồng sáp thơm cao cấp tone màu đỏ hoàng gia sang trọng. Hoa sáp bền màu lâu dài, lưu hương thơm nhẹ nhàng quyến rũ.',
    price: 650000,
    salePrice: 550000,
    category: 'Hoa sáp',
    images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
    featured: false,
  },
  {
    name: 'Kệ Hoa Khai Trương "Phát Tài Phát Lộc"',
    description: 'Kệ hoa khai trương 2 tầng sang trọng gồm hoa hồng, lan hồ điệp, thiên điểu và đồng tiền tone đỏ vàng mang ý nghĩa hồng phát, kinh doanh thịnh vượng.',
    price: 2500000,
    salePrice: 2200000,
    category: 'Hoa khai trương, chúc mừng',
    images: ['https://images.unsplash.com/photo-1587334206574-35113a8607f8?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
    featured: true,
  },
  {
    name: 'Bó Hoa Hồng Sáp 50 Bông Sweet Pink',
    description: 'Bó hoa hồng sáp 50 bông tone màu hồng phấn ngọt ngào, bọc giấy hàn quốc cao cấp. Thích hợp tặng kỉ yếu, sinh nhật lưu dấu thời gian.',
    price: 850000,
    salePrice: 750000,
    category: 'Hoa sáp',
    images: ['https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
    featured: false,
  },
  {
    name: 'Lẵng Hoa Chia Buồn "Vô Ưu"',
    description: 'Lẵng hoa tang lễ màu trắng tinh tế gồm hoa lan trắng, hoa cúc vạn thọ trắng và hoa huệ tây. Gửi gắm lòng thành kính và lời chia buồn sâu sắc nhất.',
    price: 1800000,
    salePrice: null,
    category: 'Hoa chia buồn',
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
    featured: false,
  },
  {
    name: 'Mâm Tráp Quả Rồng Phụng Đám Cưới Hỏi',
    description: 'Cặp tráp rồng phụng cưới hỏi thiết kế tinh xảo từ trái cây tươi (thanh long, cau, nho...) kết hợp hoa tươi cao cấp. Biểu tượng cho ngày song hỷ lâm môn.',
    price: 3500000,
    salePrice: 3200000,
    category: 'Mâm tráp quả rồng phụng',
    images: ['https://images.unsplash.com/photo-1512418490979-92798cfec34a?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
    featured: true,
  }
];

const seedData = async () => {
  try {
    // Database connection
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chieu_ngan_flower');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing data (Users, Products, Orders)');

    // Create Admin User
    const admin = new User({
      username: adminUsername,
      password: adminPassword,
    });
    await admin.save();
    console.log(`Admin user created:`);
    console.log(`- Tài khoản: ${adminUsername}`);
    console.log(`- Mật khẩu: ${adminPassword}`);

    // Create Products
    await Product.insertMany(mockProducts);
    console.log(`Successfully seeded ${mockProducts.length} mock products!`);

    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
