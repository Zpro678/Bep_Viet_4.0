import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminApi from '../api/AdminApi';
import './CSS/CreateUser.css';

const CreateUser = () => {
  const navigate = useNavigate();
  
  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    ho_ten: '',
    ten_dang_nhap: '',
    email: '',
    mat_khau: '',
    confirm_mat_khau: '', // Thêm trường xác nhận
    vai_tro: 'member', 
    gioi_tinh: 'khac'
  });

  // State lưu lỗi (từ frontend hoặc backend trả về)
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Helper: Kiểm tra định dạng email (Regex chuẩn)
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Xử lý khi nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Xóa lỗi của trường đó khi user bắt đầu gõ lại
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Hàm Validate Frontend (Giống Register.js)
  const validateForm = () => {
    const newErrors = {};

    // 1. Validate Email
    if (!formData.email) {
        newErrors.email = "Email không được để trống";
    } else if (!isValidEmail(formData.email)) {
        newErrors.email = "Địa chỉ Email không đúng định dạng";
    }

    // 2. Validate Mật khẩu
    if (!formData.mat_khau) {
        newErrors.mat_khau = "Mật khẩu không được để trống";
    } else if (formData.mat_khau.length < 6) {
        newErrors.mat_khau = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // 3. Validate Xác nhận mật khẩu
    if (!formData.confirm_mat_khau) {
        newErrors.confirm_mat_khau = "Vui lòng nhập lại mật khẩu";
    } else if (formData.mat_khau !== formData.confirm_mat_khau) {
        newErrors.confirm_mat_khau = "Mật khẩu nhập lại không khớp!";
    }

    // 4. Validate các trường bắt buộc khác
    if (!formData.ho_ten) newErrors.ho_ten = "Họ tên không được để trống";
    if (!formData.ten_dang_nhap) newErrors.ten_dang_nhap = "Tên đăng nhập không được để trống";

    return newErrors;
  };

  // Xử lý Submit Form
  // Xử lý Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- 1. Validate Frontend ---
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
    }

    setLoading(true);
    setErrors({}); 

    try {
      const payload = {
          ho_ten: formData.ho_ten,
          ten_dang_nhap: formData.ten_dang_nhap,
          email: formData.email,
          mat_khau: formData.mat_khau,
          vai_tro: formData.vai_tro, 
          gioi_tinh: formData.gioi_tinh
      };

      await AdminApi.createUser(payload);
      
      alert('Tạo người dùng thành công!');
      navigate('/admin/users'); 
      
    } catch (error) {
      console.error("Lỗi tạo user:", error);

      // --- XỬ LÝ LỖI TỪ BACKEND ---
      if (error.response && error.response.status === 422) {
        const backendErrors = error.response.data.errors || {};
        const mappedErrors = {};

        // Duyệt qua từng lỗi trả về
        Object.keys(backendErrors).forEach(key => {
            const originalMessage = backendErrors[key][0]; // Lấy câu lỗi gốc (Tiếng Anh)

            // --- TÙY CHỈNH THÔNG BÁO TIẾNG VIỆT ---
            if (key === 'email' && originalMessage.includes('taken')) {
                mappedErrors[key] = 'Email này đã được đăng ký, vui lòng sử dụng email khác!';
            } 
            else if (key === 'ten_dang_nhap' && originalMessage.includes('taken')) {
                mappedErrors[key] = 'Tên đăng nhập này đã tồn tại, vui lòng chọn tên khác!';
            } 
            else {
                // Các lỗi khác (ví dụ: chưa nhập, quá ngắn...) nếu muốn dịch tiếp thì thêm else if vào đây
                // Nếu không thì hiển thị tạm lỗi tiếng Anh hoặc một câu chung chung
                mappedErrors[key] = originalMessage; 
            }
        });
        
        setErrors(mappedErrors);
      } else {
        alert("Có lỗi xảy ra từ máy chủ. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-container">
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">Thêm Người Dùng Mới</h2>
          <p className="form-subtitle">Điền thông tin chi tiết để tạo tài khoản mới</p>
        </div>

        {/* Bỏ noValidate để tận dụng cả HTML5 validation nếu muốn, hoặc thêm noValidate nếu muốn full JS check */}
        <form onSubmit={handleSubmit} noValidate> 
          {/* Nhóm: Thông tin cơ bản */}
          <div className="form-group-row">
            <div className="form-group">
              <label>Họ và tên <span className="required">*</span></label>
              <input 
                type="text" 
                name="ho_ten" 
                value={formData.ho_ten} 
                onChange={handleChange}
                placeholder="Ví dụ: Nguyễn Văn A"
              />
              {errors.ho_ten && <span className="error-text">{errors.ho_ten}</span>}
            </div>

            <div className="form-group">
              <label>Giới tính</label>
              <select name="gioi_tinh" value={formData.gioi_tinh} onChange={handleChange}>
                <option value="nam">Nam</option>
                <option value="nu">Nữ</option>
                <option value="khac">Khác</option>
              </select>
            </div>
          </div>

          {/* Nhóm: Tài khoản */}
          <div className="form-group-row">
            <div className="form-group">
              <label>Tên đăng nhập <span className="required">*</span></label>
              <input 
                type="text" 
                name="ten_dang_nhap" 
                value={formData.ten_dang_nhap} 
                onChange={handleChange}
                placeholder="user123"
              />
              {errors.ten_dang_nhap && <span className="error-text">{errors.ten_dang_nhap}</span>}
            </div>

            <div className="form-group">
              <label>Vai trò <span className="required">*</span></label>
              <select 
                name="vai_tro" 
                value={formData.vai_tro} 
                onChange={handleChange}
                className="role-select"
              >
                {/* SỬA VALUE Ở ĐÂY CHO KHỚP DATABASE */}
                <option value="member">Thành viên (Member)</option> 
                <option value="admin">Quản trị viên (Admin)</option>
                <option value="blogger">Đầu bếp (Blogger)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Email <span className="required">*</span></label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange}
              placeholder="email@example.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Nhóm: Mật khẩu (Cho nằm cùng 1 dòng cho đẹp) */}
          <div className="form-group-row">
            <div className="form-group">
                <label>Mật khẩu <span className="required">*</span></label>
                <input 
                type="password" 
                name="mat_khau" 
                value={formData.mat_khau} 
                onChange={handleChange}
                placeholder="Tối thiểu 6 ký tự"
                />
                {errors.mat_khau && <span className="error-text">{errors.mat_khau}</span>}
            </div>

            <div className="form-group">
                <label>Xác nhận mật khẩu <span className="required">*</span></label>
                <input 
                type="password" 
                name="confirm_mat_khau" 
                value={formData.confirm_mat_khau} 
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                />
                {/* Lỗi xác nhận mật khẩu sẽ hiện ở đây */}
                {errors.confirm_mat_khau && <span className="error-text">{errors.confirm_mat_khau}</span>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <Link to="/admin/users" className="btn-cancel">
              Hủy bỏ
            </Link>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Tạo người dùng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;