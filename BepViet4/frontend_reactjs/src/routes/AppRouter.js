import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Import Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout'; // Đảm bảo bạn đã import AdminLayout

// Import Pages
import Home from '../components_user/Home';
import Explore from '../components_user/Explore';
import RecipeDetail from '../components_user/RecipeDetail';
import Login from '../components_user/Login';
import Register from '../components_user/Register';
import ForgotPassword from '../components_user/ForgotPassword';
import UserProfile from '../components_user/UserProfile';
import MyCookbooks from '../components_user/MyCookbooks';
import CookbookDetail from '../components_user/CookbookDetail';
import MealPlanner from '../components_user/MealPlanner'; 
import ShoppingList from '../components_user/ShoppingList';
import CreateRecipe from '../components_user/CreateRecipe';
import MyRecipes from '../components_user/MyRecipes';

// Import Admin Pages
import Dashboard from '../components_admin/Dashboard';

// --- 1. COMPONENT BẢO VỆ CHO USER (Dùng MainLayout) ---
const ProtectedRoute = ({ children, isLoggedIn, onLogout }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout onLogout={onLogout}>{children}</MainLayout>;
};

// --- 2. COMPONENT BẢO VỆ RIÊNG CHO ADMIN (QUAN TRỌNG) ---
// Chặn User thường vào Dashboard. Nếu không phải Admin -> đá về trang chủ
const AdminGuard = ({ children, isLoggedIn, onLogout }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Lấy User từ localStorage để check quyền
  const user = JSON.parse(localStorage.getItem('USER') || '{}');
  const role = user.vai_tro ? user.vai_tro.toUpperCase() : '';

  if (role !== 'ADMIN') {
    alert("Bạn không có quyền truy cập trang quản trị!");
    return <Navigate to="/" replace />;
  }

  // Nếu là Admin, dùng AdminLayout (khác với MainLayout của user)
  return <AdminLayout onLogout={onLogout}>{children}</AdminLayout>;
};

// --- 3. XỬ LÝ LOGIN & CHUYỂN HƯỚNG ---
const LoginWrapper = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  // Hàm này nhận 'role' từ Login.js gửi lên
  const handleLoginSuccess = (role) => {
    setIsLoggedIn(true);
    
    // LOGIC ĐIỀU HƯỚNG:
    if (role && role === 'ADMIN') {
        navigate('/admin/dashboard'); // Admin vào Dashboard
    } else {
        navigate('/'); // User thường vào Trang chủ
    }
  };

  return (
    <Login 
      onLogin={handleLoginSuccess} 
      onSwitchToRegister={() => navigate('/register')} 
      onSwitchToForgotPassword={() => navigate('/forgot-password')} 
    />
  );
};

const RegisterWrapper = () => {
  const navigate = useNavigate();
  return <Register onSwitchToLogin={() => navigate('/login')} />;
};

const ForgotPasswordWrapper = () => {
  const navigate = useNavigate();
  return <ForgotPassword onSwitchToLogin={() => navigate('/login')} />;
};

// --- 4. APP ROUTER CHÍNH ---
const AppRouter = ({ isLoggedIn, setIsLoggedIn, onLogout }) => {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route 
        path="/login" 
        element={!isLoggedIn ? <LoginWrapper setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/register" 
        element={!isLoggedIn ? <RegisterWrapper /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/forgot-password" 
        element={!isLoggedIn ? <ForgotPasswordWrapper /> : <Navigate to="/" replace />} 
      />

      {/* --- ADMIN ROUTES (Được bảo vệ bởi AdminGuard) --- */}
      {/* Tôi đổi path thành /admin/dashboard cho chuyên nghiệp và dễ quản lý */}
      <Route path="/admin/dashboard" element={
        <AdminGuard isLoggedIn={isLoggedIn} onLogout={onLogout}>
          <Dashboard />
        </AdminGuard>
      } />


      {/* --- USER PRIVATE ROUTES (Dùng ProtectedRoute + MainLayout) --- */}
      <Route path="/" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}>
          <Home />
        </ProtectedRoute>
      } />

      <Route path="/explore" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}>
          <Explore />
        </ProtectedRoute>
      } />

      <Route path="/my-recipes" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}>
          <MyRecipes />
        </ProtectedRoute>
      } />
      
      <Route path="/recipe/:id" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}>
          <RecipeDetail />
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}>
          <UserProfile />
        </ProtectedRoute>
      } />

      <Route path="/my-cookbooks" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}>
          <MyCookbooks />
        </ProtectedRoute>
      } />
      
      <Route path="/cookbook/:id" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}>
          <CookbookDetail />
        </ProtectedRoute>
      } />

      <Route path="/meal-planner" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}>
           <MealPlanner />
        </ProtectedRoute>
      } />

      <Route path="/shopping-list" element={
          <ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}>
            <ShoppingList />
        </ProtectedRoute>
      } />

      <Route path="/create-recipe" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}>
          <CreateRecipe />
        </ProtectedRoute>
      } />

      <Route path="/user/:id" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}>
           <div className="placeholder-page">
              <h2>Trang cá nhân người dùng (Public View)</h2>
           </div>
        </ProtectedRoute>
      } />

      {/* Route mặc định: Nếu nhập linh tinh thì về trang chủ */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;