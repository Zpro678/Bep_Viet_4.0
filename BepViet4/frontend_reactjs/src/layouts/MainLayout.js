import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

// 1. Thêm isLoggedIn vào danh sách props nhận vào
const MainLayout = ({ children, onLogout, isLoggedIn }) => {
  return (
    <div className="app-root">
      {/* 2. Truyền isLoggedIn xuống Navbar (để hiện Avatar/Tên) */}
      <Navbar onLogout={onLogout} isLoggedIn={isLoggedIn} />
      
      <div className="main-layout">
        {/* 3. Truyền isLoggedIn xuống Sidebar (để biết đường cho phép click hay chặn) */}
        <Sidebar isLoggedIn={isLoggedIn} />
        
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;