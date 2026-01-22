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

import RegionManagement from '../components_admin/RegionManagement';
import CategoryManagement from '../components_admin/CategoryManagement';
import IngredientManagement from '../components_admin/IngredientManagement';

import AddRegion from '../components_admin/AddRegion';
import AddCategory from '../components_admin/AddCategory';
import AddIngredient from '../components_admin/AddIngredient';

import EditRegion from '../components_admin/EditRegion';
import EditCategory from '../components_admin/EditCategory';

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

          {/* 👇 CÁC ROUTE MỚI CHO DANH MỤC */}
          <Route path="categories/regions" element={<RegionManagement />} />
          <Route path="categories/regions/add" element={<AddRegion />} />
          <Route path="categories/regions/edit/:id" element={<EditRegion />} />

          <Route path="categories/category" element={<CategoryManagement />} />
          <Route path="categories/category/add" element={<AddCategory />} />
          <Route path="categories/category/edit/:id" element={<EditCategory />} />

          <Route path="categories/ingredients" element={<IngredientManagement />} />
          <Route path="categories/ingredients/add" element={<AddIngredient />} />

        </Route>
      </Route>
    </Routes>
     
    
  );
};

export default AdminRouter;