import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { FaUtensils } from 'react-icons/fa';
import './CSS/AdminLayout.css'; 

const SIDEBAR_ITEMS = [
  { label: 'Tổng quan', path: '/admin/dashboard', icon: 'dashboard' },
  { label: 'Duyệt công thức', path: '/admin/DuyetCongThuc', icon: 'rate_review' },
  { label: 'Quản lý người dùng', path: '/admin/users', icon: 'people' },
];

const CATEGORY_ITEMS = [
  { label: 'Nguyên liệu', path: '/admin/categories/ingredients', icon: 'egg' },
];

const AdminLayout = ({ onLogout }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-wrapper">
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Link 
            to="/admin/dashboard" 
            className="logo-section" 
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaUtensils size={24} color="#f97316" /> 
            </div>
            <span className="logo-text" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Bếp Việt 4.0</span>
          </Link>

          <button className="btn-close-mobile" onClick={() => setIsMobileMenuOpen(false)}>
             <span className="material-icons-round">close</span>
          </button>
        </div>

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

      {isMobileMenuOpen && <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}

      <div className="main-content">
        <header className="mobile-header">
          <div className="mobile-brand">
             <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaUtensils size={20} color="#f97316" />
                <strong>Bếp Việt 4.0</strong>
             </Link>
          </div>
          <button className="btn-menu-toggle" onClick={() => setIsMobileMenuOpen(true)}>
            <span className="material-icons-round">menu</span>
          </button>
        </header>

        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;