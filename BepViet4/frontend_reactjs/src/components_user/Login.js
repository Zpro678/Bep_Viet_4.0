import React, { useState } from 'react';
import './CSS/Login.css'; 
import './CSS/Auth.css';
import authApi from '../api/authApi';


const Login = ({ onLogin, onSwitchToRegister, onSwitchToForgotPassword }) => {
  const [ten_dang_nhap, setTen_dang_nhap] = useState('');
  const [mat_khau, setMatkhau] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset lỗi cũ trước khi gửi yêu cầu mới
  
    try {
      const res = await authApi.login({ ten_dang_nhap, mat_khau });

      const { access_token, user } = res.data;
  
      localStorage.setItem('ACCESS_TOKEN', access_token);
      localStorage.setItem('USER', JSON.stringify(user));
      onLogin();
  
    } catch (err) {
   
      console.error("Lỗi đăng nhập:", err); // In lỗi ra console để dev kiểm tra

      // 1. Kiểm tra nếu Server có trả về tin nhắn lỗi cụ thể
      if (err.response && err.response.data && err.response.data.message) {
          // Hiển thị chính xác câu server nói (VD: "Tài khoản chưa kích hoạt")
          setError(err.response.data.message);
      } 
      // 2. Kiểm tra lỗi mất kết nối (Server không phản hồi)
      else if (!err.response) {
          setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.');
      }
      // 3. Các lỗi khác không xác định
      else {
          setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
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
                <label>Tên đăng nhập</label>
                <input type="text" placeholder="Nhập: admin" value={ten_dang_nhap} onChange={(e) => setTen_dang_nhap(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Mật khẩu</label>
                <input type="password" placeholder="Nhập: 123456" value={mat_khau} onChange={(e) => setMatkhau(e.target.value)} />
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