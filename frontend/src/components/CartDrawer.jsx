import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Send, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [copiedText, setCopiedText] = useState(false);

  // Form states
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
    deliveryDate: '',
  });

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const formatPrice = (amount) => {
    return amount.toLocaleString('vi-VN') + ' ₫';
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer,
          items: cartItems.map(item => ({
            product: item.product,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCreatedOrder(data.order);
        setOrderSuccess(true);
        clearCart();
      } else {
        alert(data.message || 'Có lỗi xảy ra khi tạo đơn hàng');
      }
    } catch (err) {
      alert('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const generateZaloMessage = (order) => {
    if (!order) return '';
    const itemsText = order.items
      .map((item) => `- ${item.name} (x${item.quantity})`)
      .join('\n');

    return `Xin chào Chiêu Ngân Flower, tôi vừa đặt đơn hàng trực tuyến:\n\n` +
      `* Mã Đơn Hàng: ${order._id.substring(order._id.length - 6).toUpperCase()}\n` +
      `* Khách Hàng: ${order.customer.name}\n` +
      `* Số Điện Thoại: ${order.customer.phone}\n` +
      `* Địa Chỉ Giao: ${order.customer.address}\n` +
      `* Ngày Giờ Giao: ${order.customer.deliveryDate || 'Càng sớm càng tốt'}\n` +
      `* Chi Tiết Hoa:\n${itemsText}\n` +
      `* Tổng Tiền: ${formatPrice(order.totalAmount)}\n` +
      `* Ghi Chú: ${order.customer.note || 'Không có'}\n\n` +
      `Vui lòng xác nhận đơn hàng giúp tôi nhé!`;
  };

  const handleCopyAndRedirect = () => {
    const text = generateZaloMessage(createdOrder);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
      // Open Zalo link (the shop phone number, e.g. 0898080107)
      window.open('https://zalo.me/0898080107', '_blank');
    });
  };

  if (!isOpen) return null;

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-header">
          <h3 className="cart-title">Giỏ Hàng Của Bạn</h3>
          <button className="cart-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {orderSuccess ? (
          /* Success Screen */
          <div className="cart-success-view">
            <div className="success-icon-wrapper">
              <Check size={48} className="success-icon" />
            </div>
            <h4>Đặt Hoa Thành Công!</h4>
            <p className="success-msg">
              Cám ơn bạn đã tin tưởng chọn Chiêu Ngân Flower. Đơn hàng của bạn đã được ghi nhận trên hệ thống.
            </p>
            
            {createdOrder && (
              <div className="zalo-redirect-box">
                <p className="zalo-instruction">
                  Để nhận hoa nhanh hơn, bạn hãy copy chi tiết đơn hàng dưới đây và nhắn tin qua Zalo cho Chiêu Ngân nhé!
                </p>
                
                <div className="zalo-template-preview">
                  <pre>{generateZaloMessage(createdOrder)}</pre>
                </div>

                <button 
                  onClick={handleCopyAndRedirect} 
                  className="btn btn-gold zalo-btn-action"
                >
                  {copiedText ? 'Đã copy đơn hàng!' : 'Copy đơn & Chat Zalo ngay'}
                </button>
              </div>
            )}

            <button 
              onClick={() => {
                setOrderSuccess(false);
                setCreatedOrder(null);
                onClose();
              }} 
              className="btn btn-primary btn-block-success"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          /* Normal Cart Screen */
          <>
            <div className="cart-content">
              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <p>Giỏ hàng của bạn đang trống.</p>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.product} className="cart-item">
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                      <div className="cart-item-details">
                        <h4 className="cart-item-name">{item.name}</h4>
                        <span className="cart-item-price">{formatPrice(item.price)}</span>
                        
                        <div className="cart-item-actions">
                          <div className="quantity-controller">
                            <button 
                              onClick={() => updateQuantity(item.product, item.quantity - 1)}
                              className="qty-btn"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="qty-val">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product, item.quantity + 1)}
                              className="qty-btn"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeFromCart(item.product)}
                            className="cart-remove-item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total-row">
                  <span>Tổng tiền hoa:</span>
                  <span className="cart-total-amount">{formatPrice(cartTotal)}</span>
                </div>

                {/* Checkout Form */}
                <form onSubmit={handleCheckout} className="checkout-form">
                  <h4 className="checkout-form-title">Thông Tin Giao Hoa</h4>
                  
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      placeholder="Họ và tên người nhận *"
                      className="form-control"
                      value={customer.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Số điện thoại *"
                      className="form-control"
                      value={customer.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="address"
                      placeholder="Địa chỉ giao hoa *"
                      className="form-control"
                      value={customer.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="deliveryDate"
                      placeholder="Ngày giờ giao (ví dụ: 10h sáng mai) *"
                      className="form-control"
                      value={customer.deliveryDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <textarea
                      name="note"
                      placeholder="Lời chúc ghi trên thiệp, hoặc chỉ dẫn giao hoa..."
                      className="form-control"
                      value={customer.note}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn btn-primary checkout-submit-btn ${loading ? 'btn-disabled' : ''}`}
                  >
                    {loading ? 'Đang xử lý...' : 'Đặt Hoa & Giao Tận Nơi'}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
