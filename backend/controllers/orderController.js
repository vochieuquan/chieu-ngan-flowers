const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  const { customer, items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Giỏ hàng trống!' });
  }

  try {
    let calculatedTotal = 0;
    const validatedItems = [];

    // Verify prices from db
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Không tìm thấy sản phẩm ID ${item.product}` });
      }

      const activePrice = product.salePrice || product.price;
      calculatedTotal += activePrice * item.quantity;

      validatedItems.push({
        product: product._id,
        name: product.name,
        price: activePrice,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      customer,
      items: validatedItems,
      totalAmount: calculatedTotal,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Lỗi tạo đơn hàng: ' + error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách đơn hàng: ' + error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const validStatuses = ['Pending', 'Confirmed', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Trạng thái đơn hàng không hợp lệ' });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Lỗi cập nhật trạng thái đơn hàng: ' + error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Đã xoá đơn hàng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi xoá đơn hàng: ' + error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
};
