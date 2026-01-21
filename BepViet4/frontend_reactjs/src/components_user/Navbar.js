import React, { useState, useEffect } from 'react'; // 1. Thêm useEffect
import { 
  FaUtensils, FaUserCircle, FaSignOutAlt, FaCog, FaUser, 
  FaSearch, FaFilter, FaTimes, FaSignInAlt 
} from 'react-icons/fa';
import './CSS/Navbar.css'; 
import { Link, useNavigate } from 'react-router-dom';
import userApi from '../api/userApi'; // 

const Navbar = ({ onLogout, onSearch, isLoggedIn }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [keyword, setKeyword] = useState('');
  
  // 3. State để lưu thông tin user
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    searchBy: 'name',   
    region: 'all',      
    difficulty: 'all',  
    time: 'all',        
    category: 'all'     
  });

  // --- 4. GỌI API LẤY INFO KHI ĐÃ ĐĂNG NHẬP ---
  useEffect(() => {
    const fetchProfile = async () => {
      if (isLoggedIn) {
        try {
          // Gọi API getProfile
          const response = await userApi.getProfile();
          
          // Log ra xem cấu trúc dữ liệu trả về (Debug)
          console.log("User Info:", response); 

          
         
          if (response.data) {
             setUserInfo(response.data);
          } else {
             setUserInfo(response); 
          }

        } catch (error) {
          console.error("Lỗi lấy thông tin user:", error);
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

  const handleSearchSubmit = (e) => {
    e.preventDefault(); 
    setShowFilterPanel(false);
    if (onSearch) {
      onSearch({ keyword: keyword, ...filters });
    }
  };

  // Hàm hiển thị tên (Ưu tiên ho_ten, nếu ko có thì lấy name hoặc email)
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

      {/* --- THANH TÌM KIẾM --- */}
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
            {/* ... Giữ nguyên phần nội dung bộ lọc của bạn ... */}
             <div className="filter-grid">
               {/* Copy lại phần select options ở đây nhé cho gọn */}
               <div className="filter-group">
                 <label>Tìm theo:</label>
                 <select value={filters.searchBy} onChange={(e) => handleFilterChange('searchBy', e.target.value)}>
                   <option value="name">Tên món ăn</option>
                   <option value="ingredient">Nguyên liệu</option>
                 </select>
               </div>
               {/* ...các select khác... */}
            </div>
            <div className="filter-actions">
              <button className="btn-apply" onClick={handleSearchSubmit}>Áp dụng bộ lọc</button>
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
              {/* 5. HIỂN THỊ TÊN THẬT TỪ API */}
              <span className="user-name">{getDisplayName()}</span>
              
              {/* Nếu API có trả về avatar_url thì dùng, không thì dùng icon mặc định */}
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
                <Link to="/settings" className="dropdown-item" onClick={toggleDropdown}>
                  <FaCog /> <span>Cài đặt</span>
                </Link>
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