import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Layout Admin Mới
import AdminLayout from '../layouts/AdminLayout';

// Import Pages
import Dashboard from '../components_admin/Dashboard'; 
import RecipeApproval from '../components_admin/RecipeApproval';
import AdminProtectedRoute from '../components_admin/AdminProtectedRoute';
// Các component khác bạn tự import hoặc tạo placeholder như dưới

import UserManagement from '../components_admin/UserManagement'; 
import CreateUser from '../components_admin/CreateUser';

const AdminRouter = ({ isLoggedIn, onLogout }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

  return (
   
      <Routes>
   <Route element={<AdminProtectedRoute />}>
      <Route element={<AdminLayout onLogout={onLogout} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="DuyetCongThuc" element={<div><RecipeApproval/></div>} />
        <Route path="users" element={<UserManagement />} />
        <Route path="create-user" element={<CreateUser />} />
      </Route>
      </Route>
    </Routes>
     
    
  );
};

export default AdminRouter;