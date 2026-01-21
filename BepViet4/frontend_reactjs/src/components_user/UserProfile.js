import React, { useEffect, useState } from 'react';
import './CSS/UserProfile.css';
import { FaUser, FaCamera, FaSave, FaLock } from 'react-icons/fa';
import userApi from '../api/userApi';

const UserProfile = () => {

  /* =======================
     1. STATE
  ======================= */
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    birthDate: '',
    gender: '',
    role: ''
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =======================
     2. LOAD PROFILE + OVERVIEW
  ======================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await userApi.getProfile();
        const profileData = profileRes.data;
        setUserInfo({
          fullName: profileData.ho_ten || '',
          email: profileData.email || '',
          gender: profileData.gioi_tinh || '',
          role: profileData.vai_tro || 'member',
          birthDate: profileData.ngay_sinh
            ? profileData.ngay_sinh.substring(0, 10)
            : ''
        });
        try {
          const overviewRes = await userApi.getMeOverview();
          // setOverview(overviewRes.data.ThongKe);
          setOverview({
            tong_cong_thuc: overviewRes.data.ThongKe.tong_cong_thuc ?? 0,
            tong_bai_viet: overviewRes.data.ThongKe.tong_bai_viet ?? 0,
            tong_bo_suu_tap: overviewRes.data.ThongKe.tong_bo_suu_tap ?? 0,
            tong_nguoi_theo_doi: overviewRes.data.ThongKe.tong_nguoi_theo_doi ?? 0,
            tong_nguoi_dang_theo_doi: overviewRes.data.ThongKe.tong_nguoi_dang_theo_doi ?? 0,
            tong_luot_yeu_thich: overviewRes.data.ThongKe.tong_luot_yeu_thich ?? 0,
          });

        } catch (err) {
          console.warn('Không tải được thống kê');
        }

      } catch (error) {
        alert('Không thể tải thông tin cá nhân');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* =======================
     3. HANDLE CHANGE
  ======================= */
  const handleInfoChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handlePassChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  /* =======================
     4. UPDATE PROFILE
  ======================= */
  const handleSaveInfo = async (e) => {
    e.preventDefault();

    if (!userInfo.fullName.trim()) {
      alert('Họ và tên không được để trống');
      return;
    }

    /////////////////
    if (!userInfo.email) {
      alert('Email không hợp lệ');
      return;
    }

    try {
      await userApi.updateProfile({
        ho_ten: userInfo.fullName,
        email: userInfo.email,
        ngay_sinh: userInfo.birthDate,
      });

      alert('Cập nhật thông tin thành công');
    } catch (error) {
      alert('Cập nhật thông tin thất bại');
      console.log(error.response.data.errors);
    }
  };

  /* =======================
     5. CHANGE PASSWORD
  ======================= */
  const handleChangePass = async (e) => {
    e.preventDefault();

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (passwords.new.length < 6) {
      alert('Mật khẩu mới phải ít nhất 6 ký tự');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      await userApi.updateProfile({
        ho_ten: userInfo.fullName,
        email: userInfo.email,
        // so_dien_thoai: userInfo.phone,
        // ngay_sinh: userInfo.birthDate,
        mat_khau: passwords.new
      });

      alert('Đổi mật khẩu thành công');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      alert('Mật khẩu hiện tại không đúng');
    }
  };

  if (loading) {
    return <p>Đang tải hồ sơ...</p>;
  }

  /* =======================
     6. UI (GIỮ NGUYÊN)
  ======================= */
  return (
    <div className="profile-container">

      <div className="profile-header">
        <h2>Quản lý tài khoản</h2>
      </div>

      <div className="profile-grid">

        {/* CỘT TRÁI */}
        <div className="profile-card user-card">
          <div className="avatar-wrapper">
            <FaUser className="avatar-icon" />
            <button className="btn-camera">
              <FaCamera />
            </button>
          </div>

          <h3>{userInfo.fullName}</h3>

          <span className="user-badges">
            <span className={`gender-badge ${userInfo.gender}`}>
              {userInfo.gender || 'Khác'}
            </span>
          </span>


          <p className="user-role">{userInfo.role.toUpperCase()}</p>

          {overview && (
            <div className="profile-overview">
              <div className="overview-item">🍲 Công thức <span>{overview.tong_cong_thuc}</span></div>
              <div className="overview-item">📝 Bài viết <span>{overview.tong_bai_viet}</span></div>
              <div className="overview-item">📚 Bộ sưu tập <span>{overview.tong_bo_suu_tap}</span></div>
              <div className="overview-item">❤️ Lượt yêu thích <span>{overview.tong_luot_yeu_thich}</span></div>
              <div className="overview-item">👥 Đang theo dõi <span>{overview.tong_nguoi_dang_theo_doi}</span></div>
              <div className="overview-item">⭐ Người theo dõi <span>{overview.tong_nguoi_theo_doi}</span></div>
            </div>
          )}

        </div>

        {/* CỘT PHẢI */}
        <div className="profile-content">

          {/* THÔNG TIN CÁ NHÂN */}
          <div className="profile-card">
            <div className="card-title">
              <FaUser /> Thông tin cá nhân
            </div>

            <form onSubmit={handleSaveInfo}>
              <div className="form-group-row">
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input
                    type="text"
                    name="fullName"
                    value={userInfo.fullName}
                    onChange={handleInfoChange}
                  />
                </div>

                <div className="form-group">
                  <label>Ngày sinh</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={userInfo.birthDate}
                    onChange={handleInfoChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" value={userInfo.email} disabled />
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInfoChange}
                  disabled
                />
              </div>

              <button type="submit" className="btn-save">
                <FaSave /> Lưu thay đổi
              </button>
            </form>
          </div>

          {/* ĐỔI MẬT KHẨU */}
          <div className="profile-card mt-20">
            <div className="card-title">
              <FaLock /> Đổi mật khẩu
            </div>

            <form onSubmit={handleChangePass}>
              <div className="form-group">
                <label>Mật khẩu hiện tại</label>
                <input
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={handlePassChange}
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <input
                    type="password"
                    name="new"
                    value={passwords.new}
                    onChange={handlePassChange}
                  />
                </div>

                <div className="form-group">
                  <label>Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    name="confirm"
                    value={passwords.confirm}
                    onChange={handlePassChange}
                  />
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
