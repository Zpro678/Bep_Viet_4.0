import React, { useState, useEffect } from 'react';
import {
  FaUtensils, FaUserCircle, FaSignOutAlt, FaCog, FaUser,
  FaSearch, FaFilter, FaTimes
} from 'react-icons/fa';
import './CSS/Navbar.css';
import { Link } from 'react-router-dom'; // Đã có sẵn import này

const Navbar = ({ onLogout, onSearch }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [user, setUser] = useState(null);
  const [keyword, setKeyword] = useState('');

  // load user 
  useEffect(() => {
    const storedUser = localStorage.getItem('USER');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  const [filters, setFilters] = useState({
    searchBy: 'name',
    region: 'all',
    difficulty: 'all',
    time: 'all',
    category: 'all'
  });

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleFilterPanel = () => setShowFilterPanel(!showFilterPanel);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowFilterPanel(false);
    if (onSearch) {
      onSearch({
        keyword: keyword,
        ...filters
      });
    }
  };

  return (
    <nav className="navbar">
      {/* --- LOGO (Đã sửa từ div thành Link) --- */}
      <Link to="/" className="navbar-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
        <FaUtensils className="logo-icon" />
        <h1>Bếp Việt 4.0</h1>
      </Link>

      {/* --- THANH TÌM KIẾM NÂNG CAO --- */}
      <div className="navbar-search-container">
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <input
            type="text"
            placeholder={filters.searchBy === 'name' ? "Tìm tên món ăn..." : "Tìm theo nguyên liệu..."}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <button type="button" className="btn-filter-toggle" onClick={toggleFilterPanel}>
            <FaFilter />
          </button>

          <button type="submit" className="btn-search-submit">
            <FaSearch />
          </button>
        </form>

        {/* --- PANEL BỘ LỌC --- */}
        {showFilterPanel && (
          <div className="filter-panel">
            <div className="filter-header">
              <h3>Bộ lọc tìm kiếm</h3>
              <FaTimes className="close-icon" onClick={() => setShowFilterPanel(false)} />
            </div>

            <div className="filter-grid">
              <div className="filter-group">
                <label>Tìm theo:</label>
                <select
                  value={filters.searchBy}
                  onChange={(e) => handleFilterChange('searchBy', e.target.value)}
                >
                  <option value="name">Tên món ăn</option>
                  <option value="ingredient">Nguyên liệu</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Vùng miền:</label>
                <select
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="bac">Miền Bắc</option>
                  <option value="trung">Miền Trung</option>
                  <option value="nam">Miền Nam</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Độ khó:</label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="easy">Dễ</option>
                  <option value="medium">Trung bình</option>
                  <option value="hard">Khó</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Thời gian:</label>
                <select
                  value={filters.time}
                  onChange={(e) => handleFilterChange('time', e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="short">Dưới 30 phút</option>
                  <option value="medium">30 - 60 phút</option>
                  <option value="long">Trên 1 tiếng</option>
                </select>
              </div>
            </div>

            <div className="filter-actions">
              <button
                className="btn-apply"
                onClick={handleSearchSubmit}
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- USER AVATAR & DROPDOWN --- */}
      <div className="navbar-user">
        <button onClick={toggleDropdown} className="user-btn">
          <span className="user-name">
            {user?.ho_ten || 'Tài khoản'}
          </span>
          <FaUserCircle className="user-avatar" />
        </button>

        {isDropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/profile" className="dropdown-item" onClick={toggleDropdown}>
              <FaUser /> <span>Hồ sơ</span>
            </Link>

            <Link to="/settings" className="dropdown-item" onClick={toggleDropdown}>
              <FaCog /> <span>Cài đặt</span>
            </Link>
            <div className="dropdown-divider"></div>

            <button
              className="dropdown-item text-red"
              onClick={() => {
                toggleDropdown();
                localStorage.clear(); // clear user + token
                onLogout();
              }}
            >
              <FaSignOutAlt /> <span>Đăng xuất</span>
            </button>

          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;