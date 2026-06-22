import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetail = ({ onCartOpen }) => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cardNote, setCardNote] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        if (response.ok && data.success) {
          setProduct(data.product);
        }
      } catch (error) {
        console.error('Lỗi lấy chi tiết sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const formatPrice = (amount) => {
    return amount.toLocaleString('vi-VN') + ' ₫';
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Add product to cart
    addToCart(product, quantity);
    
    // Open cart drawer
    onCartOpen();
  };

  if (loading) {
    return (
      <div className="container product-detail-loading-box">
        <div className="spinner"></div>
        <p>Đang tải chi tiết hoa...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container product-detail-error-box">
        <h3>Không Tìm Thấy Sản Phẩm</h3>
        <p>Mẫu hoa này không tồn tại hoặc đã bị gỡ xuống khỏi hệ thống.</p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} /> Quay về Trang chủ
        </Link>
      </div>
    );
  }

  const { name, price, salePrice, category, images, description, inStock } = product;
  const imageUrl = images && images.length > 0
    ? images[0]
    : 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80';

  const hasDiscount = salePrice && salePrice < price;

  return (
    <main className="product-detail-page animate-fade-in">
      <div className="container">
        {/* Breadcrumbs / Back button */}
        <div className="detail-breadcrumb">
          <Link to="/" className="back-link-btn">
            <ArrowLeft size={16} /> Quay Lại Cửa Hàng
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{name}</span>
        </div>

        {/* Main Details Grid */}
        <div className="grid-2 product-detail-grid">
          {/* Left Column - Image Container */}
          <div className="detail-image-panel">
            <div className="detail-image-card">
              <img src={imageUrl} alt={name} className="detail-main-img" />
              {!inStock && <div className="detail-out-of-stock-overlay">Hết Hàng</div>}
            </div>
          </div>

          {/* Right Column - Purchase panel */}
          <div className="detail-info-panel">
            <span className="detail-category-badge">{category}</span>
            <h1 className="detail-title">{name}</h1>

            <div className="detail-price-row">
              {hasDiscount ? (
                <>
                  <span className="detail-price-sale">{formatPrice(salePrice)}</span>
                  <span className="detail-price-original">{formatPrice(price)}</span>
                </>
              ) : (
                <span className="detail-price-regular">{formatPrice(price)}</span>
              )}
            </div>

            <div className="detail-divider"></div>

            {/* Description */}
            <div className="detail-description">
              <h3>Mô Tả Sản Phẩm</h3>
              <p>{description || 'Mẫu hoa thiết kế tinh tế của Chiêu Ngân Flower được làm thủ công từ các loại hoa tươi tuyển chọn tốt nhất trong ngày. Tone màu trang nhã, sang trọng thích hợp làm quà tặng ý nghĩa.'}</p>
            </div>

            <div className="detail-divider"></div>

            {/* Purchase action block */}
            {inStock ? (
              <div className="purchase-action-block">
                {/* Quantity select */}
                <div className="purchase-row">
                  <span className="purchase-label">Số Lượng:</span>
                  <div className="quantity-controller large">
                    <button onClick={handleDecrement} className="qty-btn">
                      -
                    </button>
                    <span className="qty-val">{quantity}</span>
                    <button onClick={handleIncrement} className="qty-btn">
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart button */}
                <div className="purchase-buttons-row">
                  <button
                    onClick={handleAddToCart}
                    className="btn btn-primary btn-add-cart-large"
                  >
                    <ShoppingBag size={20} />
                    Thêm Vào Giỏ Hàng
                  </button>

                  <a
                    href={`https://zalo.me/0898080107?text=Tôi muốn tư vấn mẫu hoa: ${encodeURIComponent(name)} (${id})`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-gold btn-chat-zalo-large"
                  >
                    <MessageCircle size={20} />
                    Tư vấn Zalo
                  </a>
                </div>
              </div>
            ) : (
              <div className="out-of-stock-action-block">
                <p className="out-of-stock-text">Sản phẩm này hiện đang hết hoa. Quý khách vui lòng liên hệ trước để florist thiết kế mẫu tương đương!</p>
                <a
                  href={`https://zalo.me/0898080107?text=Tôi muốn đặt cắm mẫu hoa hết hàng: ${encodeURIComponent(name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-gold btn-block-width"
                >
                  <MessageCircle size={20} /> Chat Zalo Nhận Tư Vấn
                </a>
              </div>
            )}

            {/* Commitment list */}
            <div className="detail-commitments">
              <div className="commitment-row">
                <span className="bullet-gold">✦</span>
                <span>Tặng kèm thiệp chúc mừng, banner in lời chúc theo yêu cầu.</span>
              </div>
              <div className="commitment-row">
                <span className="bullet-gold">✦</span>
                <span>Gửi ảnh sản phẩm hoa thực tế trước khi giao hàng để khách duyệt.</span>
              </div>
              <div className="commitment-row">
                <span className="bullet-gold">✦</span>
                <span>Nhận thiết kế hoa theo yêu cầu đặc biệt của quý khách hàng.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
