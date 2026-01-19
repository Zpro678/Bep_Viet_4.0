import React, { useState } from 'react';
import './CSS/Login.css'; 
import './CSS/Auth.css';

const Login = ({ onLogin, onSwitchToRegister, onSwitchToForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'admin' && password === '123456') {
      onLogin();
    } else {
      setError('Sai thông tin rồi! Thử: admin / 123456');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <span className="login-icon">🍳</span>
          <h2>Bếp Việt 4.0</h2>
          <p>Chia sẻ đam mê nấu nướng</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
                <label>Tên đăng nhập / Email</label>
                <input type="text" placeholder="Nhập: admin" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Mật khẩu</label>
                <input type="password" placeholder="Nhập: 123456" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {/* ĐÃ XOÁ PHẦN QUÊN MẬT KHẨU Ở ĐÂY */}

            {error && <p className="error-message">{error}</p>}
            
            {/* Nút Đăng nhập */}
            <button type="submit" className="login-btn">Đăng Nhập Ngay</button>
        </form>

        {/* --- PHẦN CUỐI FORM --- */}
        <div className="login-footer">
          
          {/* 1. Dòng Quên mật khẩu (Nằm dưới nút đăng nhập) */}
          <p style={{ marginBottom: '10px' }}>
             Bạn quên mật khẩu? <span className="link" onClick={onSwitchToForgotPassword}>Lấy lại ngay</span>
          </p>

          {/* 2. Dòng Đăng ký (Nằm dưới cùng) */}
          <p>
             Chưa có tài khoản? <span className="link" onClick={onSwitchToRegister}>Đăng ký</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;