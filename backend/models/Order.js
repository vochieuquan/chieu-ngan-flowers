const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Số lượng tối thiểu là 1'],
  },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: {
        type: String,
        required: [true, 'Vui lòng cung cấp tên người mua'],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, 'Vui lòng cung cấp số điện thoại liên hệ'],
        trim: true,
      },
      address: {
        type: String,
        required: [true, 'Vui lòng cung cấp địa chỉ giao hoa'],
        trim: true,
      },
      note: {
        type: String,
        trim: true,
      },
      deliveryDate: {
        type: String,
        trim: true,
      },
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Tổng tiền không được âm'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
