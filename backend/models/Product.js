const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên hoa'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Vui lòng nhập giá bán'],
      min: [0, 'Giá bán không được âm'],
    },
    salePrice: {
      type: Number,
      min: [0, 'Giá khuyến mãi không được âm'],
      validate: {
        validator: function (value) {
          return !value || value < this.price;
        },
        message: 'Giá khuyến mãi phải nhỏ hơn giá gốc',
      },
    },
    category: {
      type: String,
      required: [true, 'Vui lòng nhập danh mục hoa'],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
