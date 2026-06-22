const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    let query = {};

    // Filter by category
    if (category && category !== 'Tất cả') {
      query.category = category;
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let apiQuery = Product.find(query);

    // Sorting
    if (sort) {
      if (sort === 'price_asc') {
        apiQuery = apiQuery.sort({ price: 1 });
      } else if (sort === 'price_desc') {
        apiQuery = apiQuery.sort({ price: -1 });
      } else if (sort === 'latest') {
        apiQuery = apiQuery.sort({ createdAt: -1 });
      }
    } else {
      apiQuery = apiQuery.sort({ createdAt: -1 }); // Default: newest
    }

    const products = await apiQuery;
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy sản phẩm: ' + error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết sản phẩm: ' + error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, salePrice, category, images, inStock, featured } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      salePrice: salePrice || undefined,
      category,
      images: images || [],
      inStock: inStock !== undefined ? inStock : true,
      featured: featured !== undefined ? featured : false,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Lỗi thêm sản phẩm: ' + error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, salePrice, category, images, inStock, featured } = req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    product.name = name || product.name;
    product.description = description !== undefined ? description : product.description;
    product.price = price || product.price;
    product.salePrice = salePrice !== undefined ? (salePrice === '' ? undefined : salePrice) : product.salePrice;
    product.category = category || product.category;
    product.images = images || product.images;
    product.inStock = inStock !== undefined ? inStock : product.inStock;
    product.featured = featured !== undefined ? featured : product.featured;

    await product.save();

    res.json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Lỗi cập nhật sản phẩm: ' + error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Đã xoá sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi xoá sản phẩm: ' + error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
