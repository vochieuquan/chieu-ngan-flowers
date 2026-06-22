import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { _id, name, price, salePrice, category, images, inStock } = product;

  const imageUrl = images && images.length > 0
    ? images[0]
    : 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80';

  const formatPrice = (amount) => {
    return amount.toLocaleString('vi-VN') + ' ₫';
  };

  const hasDiscount = salePrice && salePrice < price;
  const discountPercent = hasDiscount
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  return (
    <div className={`card product-card ${!inStock ? 'out-of-stock' : ''}`}>
      <div className="product-image-wrapper">
        <img src={imageUrl} alt={name} className="product-image" loading="lazy" />
        
        {/* Badges */}
        {hasDiscount && inStock && (
          <span className="badge-discount">-{discountPercent}%</span>
        )}
        {!inStock && <span className="badge-out-of-stock">Hết hàng</span>}

        {/* Hover Actions */}
        {inStock && (
          <div className="product-hover-actions">
            <button
              onClick={() => addToCart(product, 1)}
              className="action-circle-btn"
              title="Thêm vào giỏ hàng"
            >
              <ShoppingCart size={18} />
            </button>
            <Link
              to={`/product/${_id}`}
              className="action-circle-btn"
              title="Xem chi tiết"
            >
              <Eye size={18} />
            </Link>
          </div>
        )}
      </div>

      <div className="product-info">
        <span className="product-category">{category}</span>
        <h3 className="product-name">
          <Link to={`/product/${_id}`}>{name}</Link>
        </h3>
        
        <div className="product-price-row">
          {hasDiscount ? (
            <>
              <span className="price-sale">{formatPrice(salePrice)}</span>
              <span className="price-original">{formatPrice(price)}</span>
            </>
          ) : (
            <span className="price-regular">{formatPrice(price)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
