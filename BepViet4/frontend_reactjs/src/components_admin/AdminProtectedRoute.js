import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
  // 1. Lấy thông tin từ LocalStorage
  const token = localStorage.getItem('access_token');
  const userInfoStr = localStorage.getItem('USER');
  
  let user = null;
  if (userInfoStr) {
    try {
      user = JSON.parse(userInfoStr);
    } catch (e) {
      user = null;
    }
  }
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.vai_tro ? user.vai_tro.toUpperCase() : '';

  if (userRole != 'ADMIN') {
    alert("Bạn không có quyền truy cập trang quản trị!");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;