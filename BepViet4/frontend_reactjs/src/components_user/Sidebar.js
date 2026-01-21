import React, { useState } from 'react';
import './CSS/Sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';

import { FaLock } from 'react-icons/fa';


const LoginPromptModal = ({ onClose, onConfirm }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
     
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
      
        <div className="modal-icon-wrapper">
          <FaLock />
        </div>

        <h3 className="modal-title">Yêu cầu đăng nhập</h3>
        
        <p className="modal-desc">
          Tính năng này chỉ dành cho thành viên.<br/>
          Vui lòng đăng nhập để tiếp tục khám phá!
        </p>
        
        <div className="modal-action">
          <button className="btn-modal btn-modal-cancel" onClick={onClose}>
            Để sau
          </button>
          <button className="btn-modal btn-modal-confirm" onClick={onConfirm}>
            Đăng nhập ngay
          </button>
        </div>
      </div>
    </div>
  );
};


const Sidebar = ({ isLoggedIn }) => { 
  const navigate = useNavigate();
  const location = useLocation(); 
  const [showLoginModal, setShowLoginModal] = useState(false);

 
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' ? 'active' : '';
    return location.pathname.startsWith(path) ? 'active' : '';
  };

 
  const handleNavigation = (path) => {
    const publicPaths = ['/', '/explore']; 

   
    if (isLoggedIn || publicPaths.includes(path)) {
      navigate(path);
    } else {
    
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <div className="sidebar">
        <ul className="nav-menu">
          {/* Trang chủ (Công khai) */}
          <li className={`nav-item ${isActive('/')}`} onClick={() => handleNavigation('/')}>
            <span className="nav-icon">🏠</span> Trang chủ
          </li>

          {/* Khám phá (Công khai) */}
          <li className={`nav-item ${isActive('/explore')}`} onClick={() => handleNavigation('/explore')}>
            <span className="nav-icon">🌍</span> Khám phá
          </li>
          
          {/* Công thức cá nhân (Riêng tư) */}
          <li className={`nav-item ${isActive('/my-recipes')}`} onClick={() => handleNavigation('/my-recipes')}>
            <span className="nav-icon">📖</span> Công thức cá nhân
          </li>

          {/* Bộ sưu tập (Riêng tư) */}
          <li className={`nav-item ${isActive('/my-cookbooks')}`} onClick={() => handleNavigation('/my-cookbooks')}>
            <span className="nav-icon">📚</span> Bộ sưu tập
          </li>

          <li className={`nav-item ${isActive('/meal-planner')}`} onClick={() => handleNavigation('/meal-planner')}>
            <span className="nav-icon">📅</span> Lên thực đơn
          </li>

          <li className={`nav-item ${isActive('/shopping-list')}`} onClick={() => handleNavigation('/shopping-list')}>
            <span className="nav-icon">🛒</span> Danh sách mua sắm
          </li>

          {/* Hồ sơ (Riêng tư) */}
          <li className={`nav-item ${isActive('/profile')}`} onClick={() => handleNavigation('/profile')}>
            <span className="nav-icon">👤</span> Hồ sơ
          </li>
        </ul>

        {/* Nút đăng bài (Riêng tư) */}
        <button 
          className="btn-post" 
          onClick={() => handleNavigation('/create-recipe')}
        >
          Đăng bài mới
        </button>
      </div>

      {/* HIỂN THỊ MODAL NẾU CẦN */}
      {showLoginModal && (
        <LoginPromptModal 
          onClose={() => setShowLoginModal(false)} 
          onConfirm={() => {
            setShowLoginModal(false);
            navigate('/login');
          }}
        />
      )}
    </>
  );
};

export default Sidebar;