const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .post(createOrder)
  .get(protectAdmin, getOrders);

router.route('/:id/status')
  .put(protectAdmin, updateOrderStatus);

router.route('/:id')
  .delete(protectAdmin, deleteOrder);

module.exports = router;
