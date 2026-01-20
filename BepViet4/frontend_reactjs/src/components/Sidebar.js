import React from 'react';
import './CSS/Sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  // Hàm kiểm tra active
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' ? 'active' : '';
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <ul className="nav-menu">
        {/* Trang chủ */}
        <li className={`nav-item ${isActive('/')}`} onClick={() => navigate('/')}>
          <span className="nav-icon">🏠</span> Trang chủ
        </li>

        {/* Khám phá */}
        <li className={`nav-item ${isActive('/explore')}`} onClick={() => navigate('/explore')}>
          <span className="nav-icon">🌍</span> Khám phá
        </li>

        {/* Bộ sưu tập */}
        <li className={`nav-item ${isActive('/my-cookbooks')}`} onClick={() => navigate('/my-cookbooks')}>
          <span className="nav-icon">📚</span> Bộ sưu tập
        </li>

        {/* --- MỚI THÊM: LÊN THỰC ĐƠN --- */}
        <li className={`nav-item ${isActive('/meal-planner')}`} onClick={() => navigate('/meal-planner')}>
          <span className="nav-icon">📅</span> Lên thực đơn
        </li>

        <li className={`nav-item ${isActive('/shopping-list')}`} onClick={() => navigate('/shopping-list')}>
          <span className="nav-icon">🛒</span> Danh sách mua sắm
        </li>

        {/* Hồ sơ */}
        <li className={`nav-item ${isActive('/profile')}`} onClick={() => navigate('/profile')}>
          <span className="nav-icon">👤</span> Hồ sơ
        </li>
      </ul>

      {/* Nút đăng bài */}
      <button 
        className="btn-post" 
        onClick={() => navigate('/create-recipe')}
      >
        Đăng bài mới
      </button>
    </div>
  );
};

export default Sidebar;