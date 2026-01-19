import React, { useState } from 'react';
import './CSS/Login.css'; 
import './CSS/Auth.css';

const ForgotPassword = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giả lập gửi API reset mật khẩu
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <span className="login-icon">🔐</span>
          <h2>Khôi phục mật khẩu</h2>
          <p>Nhập email để lấy lại mật khẩu</p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email đăng ký</label>
              <input 
                type="email" 
                placeholder="Ví dụ: admin@bepviet.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>
            
            <button type="submit" className="login-btn">Gửi yêu cầu</button>
          </form>
        ) : (
          <div className="success-message" style={{textAlign: 'center', padding: '20px 0'}}>
            <h3 style={{color: '#22c55e'}}>Đã gửi thành công! ✅</h3>
            <p style={{color: '#666', fontSize: '14px', marginTop: '10px'}}>
              Vui lòng kiểm tra email <strong>{email}</strong> để nhận hướng dẫn đặt lại mật khẩu.
            </p>
          </div>
        )}

        <div className="login-footer">
          <p>
            <span className="link" onClick={onSwitchToLogin}>← Quay lại Đăng nhập</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;