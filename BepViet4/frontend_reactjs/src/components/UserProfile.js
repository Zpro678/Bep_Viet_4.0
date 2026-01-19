// components/UserProfile.js
import React, { useState } from 'react';
import './CSS/UserProfile.css'; // Chúng ta sẽ tạo file CSS này ở bước sau
import { FaUser, FaCamera, FaSave, FaLock } from 'react-icons/fa';

const UserProfile = () => {
  // State quản lý thông tin
  const [userInfo, setUserInfo] = useState({
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    phone: '0901234567',
    birthDate: '1995-05-20'
  });

  // State quản lý mật khẩu
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Xử lý thay đổi input thông tin
  const handleInfoChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  // Xử lý thay đổi input mật khẩu
  const handlePassChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Submit thông tin
  const handleSaveInfo = (e) => {
    e.preventDefault();
    alert('Đã cập nhật thông tin thành công!');
    // Gọi API update ở đây
  };

  // Submit đổi mật khẩu
  const handleChangePass = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (passwords.new.length < 6) {
      alert('Mật khẩu phải trên 6 ký tự!');
      return;
    }
    alert('Đổi mật khẩu thành công!');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Quản lý tài khoản</h2>
      </div>

      <div className="profile-grid">
        {/* Cột trái: Avatar */}
        <div className="profile-card user-card">
          <div className="avatar-wrapper">
            <FaUser className="avatar-icon" />
            <button className="btn-camera">
              <FaCamera />
            </button>
          </div>
          <h3>{userInfo.fullName}</h3>
          <p>Thành viên thân thiết</p>
        </div>

        {/* Cột phải: Form */}
        <div className="profile-content">
          
          {/* Form Thông tin */}
          <div className="profile-card">
            <div className="card-title">
              <FaUser /> Thông tin cá nhân
            </div>
            <form onSubmit={handleSaveInfo}>
              <div className="form-group-row">
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input type="text" name="fullName" value={userInfo.fullName} onChange={handleInfoChange} />
                </div>
                <div className="form-group">
                  <label>Ngày sinh</label>
                  <input type="date" name="birthDate" value={userInfo.birthDate} onChange={handleInfoChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={userInfo.email} onChange={handleInfoChange} />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input type="tel" name="phone" value={userInfo.phone} onChange={handleInfoChange} />
              </div>
              <button type="submit" className="btn-save">
                <FaSave /> Lưu thay đổi
              </button>
            </form>
          </div>

          {/* Form Mật khẩu */}
          <div className="profile-card mt-20">
            <div className="card-title">
              <FaLock /> Đổi mật khẩu
            </div>
            <form onSubmit={handleChangePass}>
              <div className="form-group">
                <label>Mật khẩu hiện tại</label>
                <input type="password" name="current" value={passwords.current} onChange={handlePassChange} />
              </div>
              <div className="form-group-row">
                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <input type="password" name="new" value={passwords.new} onChange={handlePassChange} />
                </div>
                <div className="form-group">
                  <label>Xác nhận mật khẩu</label>
                  <input type="password" name="confirm" value={passwords.confirm} onChange={handlePassChange} />
                </div>
              </div>
              <button type="submit" className="btn-save btn-secondary">
                Cập nhật mật khẩu
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;