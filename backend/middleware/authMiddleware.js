const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chieu_ngan_flower_super_secret_key_123456');

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Không tìm thấy tài khoản admin' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Token không hợp lệ, truy cập bị từ chối' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Không tìm thấy Token xác thực' });
  }
};

module.exports = { protectAdmin };
