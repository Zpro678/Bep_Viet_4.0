// src/components/Register.js
import React, { useState } from 'react';
import './CSS/Register.css'; // Vẫn dùng CSS cũ
import './CSS/Auth.css';

const Register = ({ onSwitchToLogin }) => {
  // --- 1. Thêm State cho các trường mới ---
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // Thêm SĐT
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Thêm nhập lại MK
  
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Reset lỗi cũ

    // --- 2. Logic Kiểm tra dữ liệu ---
    
    // Kiểm tra rỗng
    if (!email || !phone || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ tất cả các trường!');
      return;
    }

    // Kiểm tra mật khẩu có khớp không
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp!');
      return;
    }

    // Kiểm tra độ dài số điện thoại (Ví dụ đơn giản)
    if (phone.length < 10) {
      setError('Số điện thoại không hợp lệ!');
      return;
    }

    // Giả lập đăng ký thành công
    alert("Đăng ký thành công! Mời bạn đăng nhập.");
    
    if (onSwitchToLogin) {
      onSwitchToLogin();
    }
  };

  return (
    <div className="login-container">
      {/* Thêm style maxHeight và overflow để nếu form dài quá thì cuộn được trên màn hình nhỏ */}
      <div className="login-box" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="login-header">
          <span className="login-icon">🍳</span>
          <h2>Bếp Việt 4.0</h2>
          <p>Tạo tài khoản mới để tham gia</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Email */}
          <div className="form-group">
            <label>Tên đăng nhập / Email</label>
            <input 
              type="text" 
              placeholder="Nhập email..." 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Số điện thoại (Mới) */}
          <div className="form-group">
            <label>Số điện thoại</label>
            <input 
              type="number" 
              placeholder="Nhập số điện thoại..." 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Mật khẩu */}
          <div className="form-group">
            <label>Mật khẩu</label>
            <input 
              type="password" 
              placeholder="Tạo mật khẩu..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Nhập lại Mật khẩu (Mới) */}
          <div className="form-group">
            <label>Nhập lại mật khẩu</label>
            <input 
              type="password" 
              placeholder="Xác nhận mật khẩu..." 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">Đăng Ký Ngay</button>
        </form>

        <div className="login-footer">
          <p>Đã có tài khoản? <span className="link" onClick={onSwitchToLogin}>Đăng nhập</span></p>
        </div>
      </div>
    </div>
  );
};

export default Register;