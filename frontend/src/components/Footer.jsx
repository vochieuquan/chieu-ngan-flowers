import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo">
            <span className="logo-title">Chiêu Ngân</span>
            <span className="logo-subtitle">Tiệm Hoa Quảng Ngãi</span>
          </Link>
          <p className="footer-desc">
            Chiêu Ngân Flower - Tiệm Hoa Quảng Ngãi chuyên thiết kế hoa tươi, hoa bó kỉ yếu, sinh nhật, hoa chúc mừng khai trương, hoa sáp nghệ thuật, giỏ trái cây quà tặng cao cấp và mâm tráp quả rồng phụng sang trọng tại Quảng Ngãi.
          </p>
          <div className="footer-socials" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="https://zalo.me/0898080107" target="_blank" rel="noreferrer" className="social-badge zalo">Zalo Chat: 0898 080 107</a>
            <a href="https://www.facebook.com/chieu.ngan.2024" target="_blank" rel="noreferrer" className="social-badge messenger">Facebook Chiêu Ngân</a>
            <a href="https://www.tiktok.com/@tiemhoaquangngai?_r=1&_t=ZS-97Q89JeGIWi" target="_blank" rel="noreferrer" className="social-badge tiktok" style={{ backgroundColor: '#000', color: '#fff', textAlign: 'center' }}>TikTok: @tiemhoaquangngai</a>
          </div>
        </div>

        {/* Categories Column */}
        <div className="footer-col">
          <h4 className="footer-title">Danh Mục</h4>
          <ul className="footer-links">
            <li><Link to="/?category=Hoa bó kỉ yếu, sinh nhật">Hoa Bó Kỉ Yếu, Sinh Nhật</Link></li>
            <li><Link to="/?category=Hoa khai trương, chúc mừng">Hoa Khai Trương, Chúc Mừng</Link></li>
            <li><Link to="/?category=Hoa chia buồn">Hoa Chia Buồn</Link></li>
            <li><Link to="/?category=Giỏ trái cây">Giỏ Trái Cây Quà Tặng</Link></li>
            <li><Link to="/?category=Hoa sáp">Hoa Sáp Nghệ Thuật</Link></li>
            <li><Link to="/?category=Mâm tráp quả rồng phụng">Mâm Tráp Rồng Phụng</Link></li>
          </ul>
        </div>

        {/* Opening Hours Column */}
        <div className="footer-col">
          <h4 className="footer-title">Giờ Hoạt Động</h4>
          <ul className="footer-info-list">
            <li>
              <Clock size={16} className="text-gold" />
              <span>Cửa hàng mở cửa: 7:00 - 21:00</span>
            </li>
            <li>
              <span className="text-muted">Đặt hoa Online 24/7. Giao hoa hoả tốc nhanh chóng khu vực TP. Quảng Ngãi và các huyện lân cận.</span>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="footer-col">
          <h4 className="footer-title">Liên Hệ</h4>
          <ul className="footer-info-list">
            <li>
              <MapPin size={28} className="text-gold" style={{ flexShrink: 0 }} />
              <a href="https://maps.app.goo.gl/BTUkkXXuypckmfsk8?g_st=com.google.maps.preview.copy" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
                Kiot 69 chợ Hàn Rượu, đường Nguyễn Văn Linh, phường Trương Quang Trọng, Quảng Ngãi
              </a>
            </li>
            <li>
              <Phone size={16} className="text-gold" />
              <a href="tel:0898080107" style={{ fontWeight: 'bold' }}>0898 080 107</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container footer-bottom-flex">
          <p>&copy; {new Date().getFullYear()} Chiêu Ngân Flower - Tiệm Hoa Quảng Ngãi. All rights reserved.</p>
          <p>Thiết kế tinh tế & Sang trọng</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
