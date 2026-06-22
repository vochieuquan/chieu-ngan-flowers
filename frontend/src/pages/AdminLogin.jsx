import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const { login, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to admin dashboard
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    setLocalLoading(true);
    const success = await login(username, password);
    setLocalLoading(false);

    if (success) {
      navigate('/admin');
    }
  };

  return (
    <div className="login-page-wrapper animate-fade-in">
      <div className="login-card">
        <div className="login-card-header">
          <div className="login-lock-circle">
            <Lock size={24} className="text-gold" />
          </div>
          <h2>Quản Trị Viên</h2>
          <p>Đăng nhập hệ thống quản trị cửa hàng hoa</p>
        </div>

        {error && (
          <div className="login-error-alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form-fields">
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Tên tài khoản
            </label>
            <div className="input-with-icon-wrapper">
              <UserIcon size={18} className="input-field-icon" />
              <input
                type="text"
                id="username"
                className="form-control padded-left"
                placeholder="Nhập tài khoản"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Mật khẩu
            </label>
            <div className="input-with-icon-wrapper">
              <Lock size={18} className="input-field-icon" />
              <input
                type="password"
                id="password"
                className="form-control padded-left"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={localLoading}
            className={`btn btn-primary btn-block-submit ${localLoading ? 'btn-disabled' : ''}`}
          >
            {localLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Đang kiểm tra...
              </>
            ) : (
              'Đăng Nhập Hệ Thống'
            )}
          </button>
        </form>

        <div className="login-footer-back">
          <a href="/">Quay về cửa hàng hoa</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
