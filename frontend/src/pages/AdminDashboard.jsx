import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, CheckCircle, Clock, Check, X, Eye, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ImageUploader from '../components/ImageUploader';

const AdminDashboard = () => {
  const { isAuthenticated, getAuthHeader, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Form states for Product CRUD
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Hoa bó kỉ yếu, sinh nhật',
    price: '',
    salePrice: '',
    description: '',
    images: [],
    inStock: true,
    featured: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    } else {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const res = await fetch('/api/products?sort=latest');
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } else {
        const res = await fetch('/api/orders', {
          headers: getAuthHeader(),
        });
        const data = await res.json();
        if (data.success) setOrders(data.orders);
      }
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const isEdit = !!currentProduct;
    const url = isEdit ? `/api/products/${currentProduct._id}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(productForm),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowProductModal(false);
        fetchData();
        resetProductForm();
      } else {
        alert(data.message || 'Lỗi lưu thông tin mẫu hoa');
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi kết nối máy chủ');
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      category: 'Hoa bó kỉ yếu, sinh nhật',
      price: '',
      salePrice: '',
      description: '',
      images: [],
      inStock: true,
      featured: false,
    });
    setCurrentProduct(null);
  };

  const openAddProductModal = () => {
    resetProductForm();
    setShowProductModal(true);
  };

  const openEditProductModal = (product) => {
    setCurrentProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      salePrice: product.salePrice || '',
      description: product.description || '',
      images: product.images,
      inStock: product.inStock,
      featured: product.featured,
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá mẫu hoa này không?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        fetchData();
      } else {
        alert(data.message || 'Lỗi xoá mẫu hoa');
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi kết nối máy chủ');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        fetchData();
        // Update current details if viewing
        if (currentOrder && currentOrder._id === orderId) {
          setCurrentOrder(data.order);
        }
      } else {
        alert(data.message || 'Lỗi cập nhật trạng thái đơn hàng');
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi kết nối máy chủ');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá bản ghi đơn hàng này khỏi hệ thống?')) return;

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setShowOrderModal(false);
        fetchData();
      } else {
        alert(data.message || 'Lỗi xoá đơn hàng');
      }
    } catch (err) {
      alert('Có lỗi xảy ra');
    }
  };

  const formatPrice = (amount) => {
    return amount ? amount.toLocaleString('vi-VN') + ' ₫' : '---';
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'Pending': return { label: 'Chờ xác nhận', class: 'status-pending' };
      case 'Confirmed': return { label: 'Đã xác nhận', class: 'status-confirmed' };
      case 'Delivered': return { label: 'Đã giao hoa', class: 'status-delivered' };
      case 'Cancelled': return { label: 'Đã huỷ', class: 'status-cancelled' };
      default: return { label: status, class: '' };
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="admin-dashboard-page animate-fade-in">
      {/* Dashboard Top bar */}
      <div className="admin-topbar">
        <div className="container topbar-flex">
          <div className="topbar-left">
            <h2>Kênh Quản Trị Chiêu Ngân Flower</h2>
            <p>Hệ thống CRUD sản phẩm hoa & quản lý đơn đặt hàng</p>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline btn-logout-dash">
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </div>

      {/* Tabs list */}
      <div className="container dashboard-main-content">
        <div className="dashboard-tabs">
          <button
            onClick={() => setActiveTab('products')}
            className={`tab-btn-dash ${activeTab === 'products' ? 'active' : ''}`}
          >
            Quản Lý Sản Phẩm
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`tab-btn-dash ${activeTab === 'orders' ? 'active' : ''}`}
          >
            Quản Lý Đơn Hàng
          </button>
        </div>

        {/* Tab content products */}
        {activeTab === 'products' ? (
          <div className="tab-pane-products">
            <div className="panel-actions-row">
              <h3>Danh sách các mẫu hoa ({products.length})</h3>
              <button onClick={openAddProductModal} className="btn btn-primary btn-add-flower">
                <Plus size={18} /> Thêm Mẫu Hoa Mới
              </button>
            </div>

            {loading ? (
              <div className="loading-container-dash"><div className="spinner"></div></div>
            ) : products.length === 0 ? (
              <div className="empty-panel-box"><p>Chưa có mẫu hoa nào. Hãy bắt đầu bằng cách thêm mẫu đầu tiên!</p></div>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ảnh</th>
                      <th>Tên hoa</th>
                      <th>Danh mục</th>
                      <th>Giá gốc</th>
                      <th>Giá KM</th>
                      <th>Kho hàng</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod._id}>
                        <td>
                          <img
                            src={prod.images[0] || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=80&q=80'}
                            alt={prod.name}
                            className="table-thumbnail-img"
                          />
                        </td>
                        <td className="table-col-name">{prod.name} {prod.featured && <span className="badge-feat-dash">Nổi bật</span>}</td>
                        <td>{prod.category}</td>
                        <td>{formatPrice(prod.price)}</td>
                        <td>{formatPrice(prod.salePrice)}</td>
                        <td>
                          <span className={`badge-stock-dash ${prod.inStock ? 'in' : 'out'}`}>
                            {prod.inStock ? 'Còn hoa' : 'Tạm hết'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions-flex">
                            <button onClick={() => openEditProductModal(prod)} className="table-action-btn edit" title="Sửa">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteProduct(prod._id)} className="table-action-btn delete" title="Xoá">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Tab content orders */
          <div className="tab-pane-orders">
            <div className="panel-actions-row">
              <h3>Đơn đặt hàng khách hàng ({orders.length})</h3>
            </div>

            {loading ? (
              <div className="loading-container-dash"><div className="spinner"></div></div>
            ) : orders.length === 0 ? (
              <div className="empty-panel-box"><p>Chưa nhận được đơn đặt hàng trực tuyến nào.</p></div>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Người mua</th>
                      <th>SĐT liên hệ</th>
                      <th>Tổng tiền</th>
                      <th>Giao hàng</th>
                      <th>Trạng thái</th>
                      <th>Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => {
                      const statusInfo = translateStatus(ord.status);
                      return (
                        <tr key={ord._id}>
                          <td>{ord._id.substring(ord._id.length - 6).toUpperCase()}</td>
                          <td>{ord.customer.name}</td>
                          <td>{ord.customer.phone}</td>
                          <td>{formatPrice(ord.totalAmount)}</td>
                          <td>{ord.customer.deliveryDate}</td>
                          <td>
                            <span className={`badge-status-dash ${statusInfo.class}`}>
                              {statusInfo.label}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => { setCurrentOrder(ord); setShowOrderModal(true); }}
                              className="btn btn-outline btn-table-view"
                            >
                              <Eye size={14} /> Xem
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* PRODUCT ADD/EDIT MODAL */}
      {showProductModal && (
        <div className="modal-backdrop">
          <div className="modal-card select-scroll">
            <div className="modal-header">
              <h3>{currentProduct ? 'Sửa Mẫu Thiết Kế Hoa' : 'Thêm Mẫu Hoa Thiết Kế Mới'}</h3>
              <button onClick={() => setShowProductModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="modal-body-form">
              <div className="form-group">
                <label className="form-label">Tên mẫu hoa *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Danh mục hoa *</label>
                  <select
                    className="form-control"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    <option value="Hoa bó kỉ yếu, sinh nhật">Hoa bó kỉ yếu, sinh nhật</option>
                    <option value="Hoa khai trương, chúc mừng">Hoa khai trương, chúc mừng</option>
                    <option value="Hoa chia buồn">Hoa chia buồn</option>
                    <option value="Giỏ trái cây">Giỏ trái cây</option>
                    <option value="Hoa sáp">Hoa sáp</option>
                    <option value="Mâm tráp quả rồng phụng">Mâm tráp quả rồng phụng</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Trạng thái kho</label>
                  <select
                    className="form-control"
                    value={productForm.inStock ? 'true' : 'false'}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.value === 'true' })}
                  >
                    <option value="true">Còn hoa tươi thiết kế</option>
                    <option value="false">Tạm hết hoa</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Giá gốc (VND) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="form-control"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Giá khuyến mãi (VND - bỏ trống nếu không giảm)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={productForm.salePrice}
                    onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value ? Number(e.target.value) : '' })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Hình ảnh sản phẩm * (Tải trực tiếp lên Cloudinary)</label>
                <ImageUploader
                  initialImage={productForm.images[0]}
                  onUploadSuccess={(url) => setProductForm({ ...productForm, images: url ? [url] : [] })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả hoa thiết kế</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                ></textarea>
              </div>

              <div className="checkbox-row-dash">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  />
                  <span>Đánh dấu là mẫu nổi bật (hiện ở vị trí đặc biệt)</span>
                </label>
              </div>

              <div className="modal-footer-actions">
                <button type="button" onClick={() => setShowProductModal(false)} className="btn btn-outline">
                  Huỷ bỏ
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentProduct ? 'Cập Nhật' : 'Tạo Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {showOrderModal && currentOrder && (
        <div className="modal-backdrop">
          <div className="modal-card select-scroll">
            <div className="modal-header">
              <h3>Đơn Đặt Hàng #{currentOrder._id.substring(currentOrder._id.length - 6).toUpperCase()}</h3>
              <button onClick={() => setShowOrderModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body-details">
              <div className="details-section-box">
                <h4>Thông tin người nhận hoa</h4>
                <p><strong>Họ và tên:</strong> {currentOrder.customer.name}</p>
                <p><strong>Điện thoại:</strong> {currentOrder.customer.phone}</p>
                <p><strong>Địa chỉ giao hàng:</strong> {currentOrder.customer.address}</p>
                <p><strong>Thời gian yêu cầu giao:</strong> {currentOrder.customer.deliveryDate}</p>
                <p><strong>Lời chúc/Thiệp:</strong> {currentOrder.customer.note || '(Trống)'}</p>
              </div>

              <div className="details-section-box">
                <h4>Chi tiết mẫu hoa đặt</h4>
                <div className="ordered-items-list-dash">
                  {currentOrder.items.map((item, idx) => (
                    <div key={idx} className="ordered-item-row-dash">
                      <span>{item.name} <strong>x{item.quantity}</strong></span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="ordered-total-row-dash">
                    <span>Tổng đơn hàng:</span>
                    <span>{formatPrice(currentOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="details-section-box">
                <h4>Cập nhật trạng thái đơn hàng</h4>
                <div className="status-updater-grid">
                  {['Pending', 'Confirmed', 'Delivered', 'Cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateOrderStatus(currentOrder._id, status)}
                      className={`status-opt-btn ${status} ${currentOrder.status === status ? 'active' : ''}`}
                    >
                      {translateStatus(status).label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-footer-actions row-between">
                <button
                  type="button"
                  onClick={() => handleDeleteOrder(currentOrder._id)}
                  className="btn btn-outline btn-danger-dash"
                >
                  <Trash2 size={16} /> Xoá Đơn Hàng
                </button>
                <button type="button" onClick={() => setShowOrderModal(false)} className="btn btn-primary">
                  Đóng Chi Tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
