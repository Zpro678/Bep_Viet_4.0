import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children, onLogout }) => {
  return (
    <div className="app-root">
      <Navbar onLogout={onLogout} />
      <div className="main-layout">
        <Sidebar />
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;