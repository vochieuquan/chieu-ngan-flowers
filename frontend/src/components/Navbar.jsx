import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Lock, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onCartOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" className="logo-brand">
          <span className="logo-title">Chiêu Ngân</span>
          <span className="logo-subtitle">Tiệm Hoa Quảng Ngãi</span>
        </Link>

        {/* Navigation Links */}
        <nav className={`nav-menu ${isOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link to="/" className={isActive('/')} onClick={() => setIsOpen(false)}>
                Trang Chủ
              </Link>
            </li>
            <li>
              <Link to="/?category=Hoa bó kỉ yếu, sinh nhật" onClick={() => setIsOpen(false)}>
                Hoa Bó Kỉ Yếu, Sinh Nhật
              </Link>
            </li>
            <li>
              <Link to="/?category=Hoa khai trương, chúc mừng" onClick={() => setIsOpen(false)}>
                Hoa Khai Trương, Chúc Mừng
              </Link>
            </li>
            <li>
              <Link to="/?category=Hoa chia buồn" onClick={() => setIsOpen(false)}>
                Hoa Chia Buồn
              </Link>
            </li>
            <li>
              <Link to="/?category=Giỏ trái cây" onClick={() => setIsOpen(false)}>
                Giỏ Trái Cây
              </Link>
            </li>
            <li>
              <Link to="/?category=Hoa sáp" onClick={() => setIsOpen(false)}>
                Hoa Sáp
              </Link>
            </li>
            <li>
              <Link to="/?category=Mâm tráp quả rồng phụng" onClick={() => setIsOpen(false)}>
                Mâm Tráp Quả Rồng Phụng
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link to="/admin" className={`admin-link-nav ${isActive('/admin')}`} onClick={() => setIsOpen(false)}>
                  Quản Trị
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Action Buttons */}
        <div className="header-actions">
          {isAuthenticated && (
            <button className="icon-btn logout-btn" onClick={handleLogout} title="Đăng xuất">
              <LogOut size={20} />
            </button>
          )}

          <button className="icon-btn cart-toggle-btn" onClick={onCartOpen} title="Giỏ hàng">
            <ShoppingBag size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
