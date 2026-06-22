import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Heart, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ['/cover.jpg', '/cover2.jpg'];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  const category = searchParams.get('category') || 'Tất cả';

  // Categories list matching backend schema
  const categories = [
    'Tất cả',
    'Hoa bó kỉ yếu, sinh nhật',
    'Hoa khai trương, chúc mừng',
    'Hoa chia buồn',
    'Giỏ trái cây',
    'Hoa sáp',
    'Mâm tráp quả rồng phụng'
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/api/products?sort=${sort}`;
        if (category && category !== 'Tất cả') {
          url += `&category=${encodeURIComponent(category)}`;
        }
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        if (response.ok && data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search, sort]);

  const handleCategoryChange = (cat) => {
    if (cat === 'Tất cả') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Fetch runs automatically on dependency change
  };

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        {slides.map((slide, idx) => (
          <div
            key={slide}
            className={`hero-slide ${currentSlide === idx ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide})` }}
          ></div>
        ))}
        <div className="hero-bg-overlay"></div>
        <div className="container hero-container-flex">
          <div className="hero-content">
            <span className="hero-badge"><Sparkles size={16} /> Tiệm Hoa Quảng Ngãi</span>
            <h1 className="hero-title" style={{ fontSize: '3.5rem' }}>Chiêu Ngân Flower</h1>
            <p className="hero-subtitle">
              Địa chỉ: Kiot 69 chợ Hàn Rượu, đường Nguyễn Văn Linh, Quảng Ngãi. Chuyên thiết kế hoa tươi, hoa sáp, giỏ trái cây cao cấp & mâm tráp cưới hỏi rồng phụng.
            </p>
            <a href="#flower-catalog" className="btn btn-gold hero-cta-btn">
              Khám Phá Bộ Sưu Tập
            </a>
          </div>
        </div>
      </section>

      {/* Highlights / Features Section */}
      <section className="features-section">
        <div className="container features-grid">
          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <Heart className="feature-icon" size={24} />
            </div>
            <h4>Thiết Kế Độc Quyền</h4>
            <p>Hoa được cắm tỉ mỉ bởi các florist chuyên nghiệp, mang đậm cá tính riêng.</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <ShieldCheck className="feature-icon" size={24} />
            </div>
            <h4>Chất Lượng Cam Kết</h4>
            <p>100% hoa tươi nhập khẩu và hoa nội địa tuyển chọn kỹ càng từng bông mỗi ngày.</p>
          </div>

          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <Truck className="feature-icon" size={24} />
            </div>
            <h4>Giao Hoa Hoả Tốc</h4>
            <p>Giao hoa nhanh chóng trong vòng 2h tại khu vực nội thành, bảo đảm hoa tươi nguyên vẹn.</p>
          </div>
        </div>
      </section>

      {/* Main Flower Catalog */}
      <section id="flower-catalog" className="catalog-section">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-sub-title">Bộ Sưu Tập Của Chúng Tôi</span>
            <h2 className="section-title">Chọn Hoa Theo Dịp</h2>
            <div className="decorative-line"></div>
          </div>

          {/* Categories Tab Selector */}
          <div className="categories-tabs-scroll">
            <div className="categories-tabs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`category-tab-btn ${category === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Filters Row */}
          <div className="catalog-filter-row">
            <form onSubmit={handleSearchSubmit} className="search-box-form">
              <input
                type="text"
                placeholder="Tìm tên hoa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input-field"
              />
              <button type="submit" className="search-btn-submit">
                <Search size={18} />
              </button>
            </form>

            <div className="sort-box-wrapper">
              <SlidersHorizontal size={16} className="text-muted" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="sort-select-field"
              >
                <option value="latest">Mới nhất</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Đang tải danh sách hoa...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-catalog-alert">
              <p>Hiện không tìm thấy mẫu hoa nào khớp với lựa chọn của bạn.</p>
              <button 
                onClick={() => {
                  setSearch('');
                  searchParams.delete('category');
                  setSearchParams(searchParams);
                }} 
                className="btn btn-outline"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid-3 products-grid-home">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to action - custom order */}
      <section className="custom-order-banner">
        <div className="custom-order-overlay"></div>
        <div className="container custom-order-content">
          <h3>Bạn muốn một mẫu thiết kế hoa riêng biệt?</h3>
          <p>
            Liên hệ trực tiếp với các chuyên gia cắm hoa của Chiêu Ngân Flower để được tư vấn chọn hoa, lên tone màu và cắm theo ngân sách riêng của bạn.
          </p>
          <a href="https://zalo.me/0898080107" target="_blank" rel="noreferrer" className="btn btn-gold">
            Chat Qua Zalo Tư Vấn
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
