import React, { useState, useEffect } from 'react';
import { 
  FaUtensils, FaUserCircle, FaSignOutAlt, FaCog, FaUser, 
  FaSearch, FaFilter, FaTimes, FaSignInAlt 
} from 'react-icons/fa';
import './CSS/Navbar.css'; 
import { Link, useNavigate, createSearchParams } from 'react-router-dom';
import userApi from '../api/userApi'; 

const Navbar = ({ onLogout, isLoggedIn }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  
  // State user
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();
  
  // State tìm kiếm và lọc
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState({
    ma_vung_mien: '',   // Backend: ma_vung_mien
    do_kho: '',         // Backend: do_kho (1, 2, 3, 4, 5)
    thoi_gian_nau: ''   // Backend: thoi_gian_nau
  });

  // Lấy thông tin user
  useEffect(() => {
    const fetchProfile = async () => {
      if (isLoggedIn) {
        try {
          const response = await userApi.getProfile();
          setUserInfo(response.data || response);
        } catch (error) {
          console.error("Lỗi user:", error);
        }
      } else {
        setUserInfo(null);
      }
    };
    fetchProfile();
  }, [isLoggedIn]); 

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleFilterPanel = () => setShowFilterPanel(!showFilterPanel);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // --- XỬ LÝ TÌM KIẾM ---
  const handleSearchSubmit = (e) => {
    e.preventDefault(); 
    setShowFilterPanel(false);

    // Tạo object params, loại bỏ các giá trị rỗng
    const params = {
        keyword: keyword,
        ...filters
    };

    // Loại bỏ các key có giá trị rỗng để URL đẹp hơn
    Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === 'all') {
            delete params[key];
        }
    });

    // Điều hướng sang trang Explore kèm query params
    navigate({
        pathname: '/explore',
        search: `?${createSearchParams(params)}`,
    });
  };

  const getDisplayName = () => {
    if (!userInfo) return "Người dùng";
    return userInfo.ho_ten || userInfo.name || userInfo.email || "Người dùng";
  };

  return (
    <nav className="navbar">
      {/* --- LOGO --- */}
      <Link to="/" className="navbar-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
        <FaUtensils className="logo-icon" />
        <h1>Bếp Việt 4.0</h1>
      </Link>

      {/* --- SEARCH BAR --- */}
      <div className="navbar-search-container">
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <input 
            type="text" 
            placeholder="Tìm tên món ăn..."
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

        {/* --- FILTER PANEL --- */}
        {showFilterPanel && (
          <div className="filter-panel">
            <div className="filter-header">
              <h3>Bộ lọc tìm kiếm</h3>
              <FaTimes className="close-icon" onClick={() => setShowFilterPanel(false)} />
            </div>
            
            <div className="filter-grid">
               {/* 1. Vùng miền */}
               <div className="filter-group">
                 <label>Vùng miền:</label>
                 <select 
                   value={filters.ma_vung_mien} 
                   onChange={(e) => handleFilterChange('ma_vung_mien', e.target.value)}
                 >
                   <option value="">Tất cả</option>
                   <option value="1">Miền Bắc</option>
                   <option value="2">Miền Trung</option>
                   <option value="3">Miền Nam</option>
                 </select>
               </div>

               {/* 2. Độ khó (Đã sửa theo yêu cầu) */}
               <div className="filter-group">
                 <label>Độ khó:</label>
                 <select 
                   value={filters.do_kho} 
                   onChange={(e) => handleFilterChange('do_kho', e.target.value)}
                 >
                   <option value="">Tất cả</option>
                   <option value="1">Rất Dễ</option>
                   <option value="2">Dễ</option>
                   <option value="3">Vừa</option>
                   <option value="4">Khó</option>
                   <option value="5">Rất Khó</option>
                 </select>
               </div>

               {/* 3. Thời gian nấu (Đã mở rộng phạm vi) */}
               <div className="filter-group">
                 <label>Thời gian nấu:</label>
                 <select 
                   value={filters.thoi_gian_nau} 
                   onChange={(e) => handleFilterChange('thoi_gian_nau', e.target.value)}
                 >
                   <option value="">Tất cả</option>
                   <option value="15">Dưới 15 phút (Siêu nhanh)</option>
                   <option value="30">Dưới 30 phút</option>
                   <option value="60">Dưới 60 phút (1 tiếng)</option>
                   <option value="90">Dưới 90 phút</option>
                   <option value="120">Dưới 2 tiếng</option>
                   <option value="180">Dưới 3 tiếng (Hầm/Ninh)</option>
                 </select>
               </div>
            </div>

            <div className="filter-actions">
              <button className="btn-apply" onClick={handleSearchSubmit}>Áp dụng</button>
            </div>
          </div>
        )}
      </div>

      {/* --- USER / LOGIN --- */}
      <div className="navbar-user">
        {!isLoggedIn ? (
          <button className="btn-login" onClick={() => navigate('/login')}>
            <FaSignInAlt /> Đăng nhập
          </button>
        ) : (
          <>
            <button onClick={toggleDropdown} className="user-btn">
              <span className="user-name">{getDisplayName()}</span>
              {userInfo?.avatar ? (
                 <img src={userInfo.avatar} alt="Avatar" className="user-avatar-img" style={{width: 30, height: 30, borderRadius: '50%'}} />
              ) : (
                 <FaUserCircle className="user-avatar" />
              )}
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item" onClick={toggleDropdown}>
                  <FaUser /> <span>Hồ sơ</span>
                </Link>
                {/* Check role admin nếu cần */}
                {userInfo?.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item">
                        <FaCog /> <span>Trang Admin</span>
                    </Link>
                )}
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item text-red" 
                  onClick={() => { toggleDropdown(); onLogout(); }}
                >
                  <FaSignOutAlt /> <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;