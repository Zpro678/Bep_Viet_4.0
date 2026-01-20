import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Import Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

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

// =========================================================================
// PHẦN 1: CÁC ROUTE GUARD
// =========================================================================

const AdminGuard = ({ children, isLoggedIn, onLogout }) => {
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const user = JSON.parse(localStorage.getItem('USER') || '{}');
  const role = user.vai_tro ? user.vai_tro.toUpperCase() : '';

  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  return <AdminLayout onLogout={onLogout}>{children}</AdminLayout>;
};

const ProtectedRoute = ({ children, isLoggedIn, onLogout }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout isLoggedIn={isLoggedIn} onLogout={onLogout}>{children}</MainLayout>;
};

// --- QUAN TRỌNG: PublicRoute nhận isLoggedIn để truyền xuống Layout ---
const PublicRoute = ({ children, isLoggedIn, onLogout }) => {
  return <MainLayout isLoggedIn={isLoggedIn} onLogout={onLogout}>{children}</MainLayout>;
};

// =========================================================================
// PHẦN 2: LOGIC LOGIN/REGISTER
// =========================================================================

const LoginWrapper = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const handleLoginSuccess = (role) => {
    setIsLoggedIn(true);
    if (role && role.toUpperCase() === 'ADMIN') {
        navigate('/admin/dashboard');
    } else {
        navigate('/');
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

// =========================================================================
// PHẦN 3: APP ROUTER CHÍNH
// =========================================================================

const AppRouter = ({ isLoggedIn, setIsLoggedIn, onLogout }) => {
  return (
    <Routes>
      {/* --- A. AUTH ROUTES --- */}
      <Route path="/login" element={!isLoggedIn ? <LoginWrapper setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!isLoggedIn ? <RegisterWrapper /> : <Navigate to="/" replace />} />
      <Route path="/forgot-password" element={!isLoggedIn ? <ForgotPasswordWrapper /> : <Navigate to="/" replace />} />

      {/* --- B. ADMIN ROUTES --- */}
      <Route path="/admin/dashboard" element={
        <AdminGuard isLoggedIn={isLoggedIn} onLogout={onLogout}>
          <Dashboard />
        </AdminGuard>
      } />

      {/* --- C. PUBLIC USER ROUTES (ĐÃ SỬA LỖI TẠI ĐÂY) --- */}
      {/* Bạn phải truyền isLoggedIn vào đây thì Navbar mới hiện info user */}
      
      <Route path="/" element={
        <PublicRoute isLoggedIn={isLoggedIn} onLogout={onLogout}>
          <Home />
        </PublicRoute>
      } />
      
      <Route path="/explore" element={
        <PublicRoute isLoggedIn={isLoggedIn} onLogout={onLogout}>
          <Explore />
        </PublicRoute>
      } />

      {/* --- D. PRIVATE USER ROUTES --- */}
      <Route path="/my-recipes" element={<ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}><MyRecipes /></ProtectedRoute>} />
      <Route path="/recipe/:id" element={<ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}><RecipeDetail /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}><UserProfile /></ProtectedRoute>} />
      <Route path="/my-cookbooks" element={<ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}><MyCookbooks /></ProtectedRoute>} />
      <Route path="/cookbook/:id" element={<ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}><CookbookDetail /></ProtectedRoute>} />
      <Route path="/meal-planner" element={<ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}><MealPlanner /></ProtectedRoute>} />
      <Route path="/shopping-list" element={<ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}><ShoppingList /></ProtectedRoute>} />
      <Route path="/create-recipe" element={<ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}><CreateRecipe /></ProtectedRoute>} />
      
      <Route path="/user/:id" element={<ProtectedRoute isLoggedIn={isLoggedIn} onLogout={onLogout}><div>Trang xem user khác</div></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;