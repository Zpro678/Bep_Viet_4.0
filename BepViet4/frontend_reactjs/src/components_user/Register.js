// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import authApi from '../api/authApi';
import './CSS/Register.css';
import './CSS/Auth.css';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    ten_dang_nhap: '',
    email: '',
    mat_khau: '',
    confirm_mat_khau: '',
    ho_ten: '',
    ngay_sinh: '',
    gioi_tinh: 'Nam'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Hàm kiểm tra email hợp lệ
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- 1. VALIDATE FRONTEND (Giữ nguyên) ---
    if (!formData.ten_dang_nhap || !formData.email || !formData.ho_ten || !formData.mat_khau || !formData.confirm_mat_khau || !formData.ngay_sinh) {
        setError('Vui lòng điền đầy đủ thông tin!');
        return; 
    }

    if (!isValidEmail(formData.email)) {
        setError('Địa chỉ Email không đúng định dạng!');
        return;
    }

    const today = new Date();
    const birthDate = new Date(formData.ngay_sinh);
    if (birthDate >= today) {
        setError('Ngày sinh không hợp lệ (phải trước ngày hôm nay)!');
        return;
    }

    if (formData.mat_khau !== formData.confirm_mat_khau) {
      setError('Mật khẩu nhập lại không khớp!');
      return;
    }

    if (formData.mat_khau.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }

    // --- 2. GỌI API ---
    setLoading(true);

    try {
      const payload = {
        ten_dang_nhap: formData.ten_dang_nhap,
        email: formData.email,
        mat_khau: formData.mat_khau,
        ho_ten: formData.ho_ten,
        ngay_sinh: formData.ngay_sinh,
        gioi_tinh: formData.gioi_tinh
      };

      const response = await authApi.register(payload);

      if (response.status === 'success' || response.access_token) {
        // Thành công -> Báo user và chuyển về trang Login
        alert(`Đăng ký thành công! Vui lòng đăng nhập.`);
        if (onSwitchToLogin) {
            onSwitchToLogin();
        } else {
            navigate('/login');
        }
      }

    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      
      // --- 3. XỬ LÝ LỖI VÀ DỊCH SANG TIẾNG VIỆT (PHẦN QUAN TRỌNG) ---
      if (err.response && err.response.data && err.response.data.errors) {
        const errorList = err.response.data.errors;
        
        // Lấy tên trường lỗi đầu tiên (ví dụ: 'email' hoặc 'ten_dang_nhap')
        const fieldName = Object.keys(errorList)[0]; 
        // Lấy nội dung lỗi tiếng Anh (ví dụ: 'The email has already been taken.')
        const errorMessage = errorList[fieldName][0]; 
        
        // Kiểm tra xem lỗi có phải là "taken" (Đã tồn tại) không?
        if (errorMessage.includes('taken')) {
            // 👇 Xử lý cho EMAIL
            if (fieldName === 'email') {
                setError('Email này đã được đăng ký, vui lòng sử dụng email khác!');
            } 
            // 👇 Xử lý cho TÊN ĐĂNG NHẬP (Y hệt email)
            else if (fieldName === 'ten_dang_nhap') {
                setError('Tên đăng nhập này đã tồn tại, vui lòng chọn tên khác!');
            } 
            // Các trường hợp trùng khác
            else {
                setError('Dữ liệu này đã tồn tại trên hệ thống.');
            }
        } 
        // 👇 Xử lý lỗi Ngày sinh (nếu có)
        else if (fieldName === 'ngay_sinh') {
              setError('Ngày sinh không hợp lệ!');
        }
        // 👇 Các lỗi còn lại (Dịch sơ bộ hoặc để nguyên)
        else {
            // Ví dụ: 'The ten dang nhap field is required.' -> thay thế đơn giản
            let cleanMsg = errorMessage.replace('The ', '').replace(' field is required.', ' không được để trống.');
            setError(cleanMsg); 
        }

      } else {
        // Lỗi chung (Server error, mất mạng...)
        setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="login-header">
          <span className="login-icon">🍳</span>
          <h2>Bếp Việt 4.0</h2>
          <p>Tạo tài khoản mới</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          
          <div className="form-group">
            <label>Tên đăng nhập (*)</label>
            <input 
              type="text" 
              name="ten_dang_nhap"
              placeholder="VD: user123" 
              value={formData.ten_dang_nhap}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Họ và tên (*)</label>
            <input 
              type="text" 
              name="ho_ten"
              placeholder="VD: Nguyễn Văn A" 
              value={formData.ho_ten}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email (*)</label>
            <input 
              type="email" 
              name="email"
              placeholder="email@example.com" 
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Ngày sinh (*)</label>
              <input 
                type="date" 
                name="ngay_sinh"
                value={formData.ngay_sinh}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Giới tính</label>
              <select 
                name="gioi_tinh" 
                value={formData.gioi_tinh} 
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Mật khẩu (*)</label>
            <input 
              type="password" 
              name="mat_khau"
              placeholder="Tối thiểu 6 ký tự"
              value={formData.mat_khau}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu (*)</label>
            <input 
              type="password" 
              name="confirm_mat_khau"
              placeholder="Nhập lại mật khẩu" 
              value={formData.confirm_mat_khau}
              onChange={handleChange}
            />
          </div>

          {/* Sửa style: Bỏ in đậm, giữ màu đỏ */}
          {error && <p className="error-message" style={{ color: 'red', textAlign: 'center', margin: '10px 0', fontSize: '14px' }}>{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng Ký Ngay'}
          </button>
        </form>

        <div className="login-footer">
          <p>Đã có tài khoản? <span className="link" onClick={onSwitchToLogin}>Đăng nhập</span></p>
        </div>
      </div>
    </div>
  );
};

export default Register;