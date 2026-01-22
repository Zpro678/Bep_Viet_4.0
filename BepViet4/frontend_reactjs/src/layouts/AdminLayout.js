import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import './CSS/AdminLayout.css'; 

const SIDEBAR_ITEMS = [
  { label: 'Tổng quan', path: '/admin/dashboard', icon: 'dashboard' },
  { label: 'Duyệt công thức', path: '/admin/DuyetCongThuc', icon: 'rate_review' },
  { label: 'Quản lý người dùng', path: '/admin/users', icon: 'people' },
];

const CATEGORY_ITEMS = [
  // { label: 'Loại món ăn', path: '/admin/categories/types', icon: 'restaurant' },
  // { label: 'Bữa ăn', path: '/admin/categories/meals', icon: 'schedule' },
  // { label: 'Chế độ ăn', path: '/admin/categories/diets', icon: 'spa' },
  { label: 'Nguyên liệu', path: '/admin/categories/ingredients', icon: 'egg' },
  { label: 'Danh mục', path: '/admin/categories/category', icon: 'category' }, 
  { label: 'Vùng miền', path: '/admin/categories/regions', icon: 'public' },
];

const AdminLayout = ({ onLogout }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-wrapper">
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <div className="logo-icon">
            <span className="material-icons-round">soup_kitchen</span>
          </div>
          <span className="logo-text">CookSpace</span>
          {/* Nút đóng menu trên mobile */}
          <button className="btn-close-mobile" onClick={() => setIsMobileMenuOpen(false)}>
             <span className="material-icons-round">close</span>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="sidebar-nav">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-icons-round nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </Link>
          ))}

          <div className="nav-divider-label">Danh mục</div>

          {CATEGORY_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-icons-round nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer Sidebar */}
        <div className="sidebar-footer">
          <Link to="/admin/settings" className="nav-item footer-link">
            <span className="material-icons-round">settings</span>
            <span>Cài đặt</span>
          </Link>

          <div className="user-profile-box">
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=f97316&color=fff"
              alt="Admin"
              className="user-avatar"
            />
            <div className="user-info">
              <p className="user-name">Admin</p>
              <p className="user-role">Super Admin</p>
            </div>
            <button onClick={onLogout} className="btn-logout" title="Đăng xuất">
              <span className="material-icons-round">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay cho Mobile khi mở menu */}
      {isMobileMenuOpen && <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* Header Mobile (Chỉ hiện khi màn hình nhỏ) */}
        <header className="mobile-header">
          <div className="mobile-brand">
             <span className="material-icons-round logo-mini">soup_kitchen</span>
             <strong>CookSpace</strong>
          </div>
          <button className="btn-menu-toggle" onClick={() => setIsMobileMenuOpen(true)}>
            <span className="material-icons-round">menu</span>
          </button>
        </header>

        {/* Nơi nội dung trang con hiển thị */}
        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;