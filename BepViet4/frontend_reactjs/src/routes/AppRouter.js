import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Import Layout
import MainLayout from '../layouts/MainLayout';

// Import Pages
import Home from '../components/Home';
import Explore from '../components/Explore';
import RecipeDetail from '../components/RecipeDetail';
import Login from '../components/Login';
import Register from '../components/Register';
import ForgotPassword from '../components/ForgotPassword';
import UserProfile from '../components/UserProfile';
import MyCookbooks from '../components/MyCookbooks';
import CookbookDetail from '../components/CookbookDetail';
import MealPlanner from '../components/MealPlanner'; 
import ShoppingList from '../components/ShoppingList';
import CreateRecipe from '../components/CreateRecipe';
const ProtectedRoute = ({ children, isLoggedIn, onLogout }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout isLoggedIn={true} onLogout={onLogout}>{children}</MainLayout>;
};

// 2. Route Công khai (Trang chủ, Khám phá - Ai cũng xem được)
// Vẫn bọc MainLayout để hiện Sidebar/Navbar
const PublicRoute = ({ children, isLoggedIn, onLogout }) => {
  return <MainLayout isLoggedIn={isLoggedIn} onLogout={onLogout}>{children}</MainLayout>;
};

const LoginWrapper = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  return (
    <Login 
      onLogin={() => { setIsLoggedIn(true); navigate('/'); }} 
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

const AppRouter = ({ isLoggedIn, setIsLoggedIn, onLogout }) => {
  return (
    <Routes>
      {/* --- AUTH ROUTES --- */}
      <Route path="/login" element={!isLoggedIn ? <LoginWrapper setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!isLoggedIn ? <RegisterWrapper /> : <Navigate to="/" replace />} />
      <Route path="/forgot-password" element={!isLoggedIn ? <ForgotPasswordWrapper /> : <Navigate to="/" replace />} />

      {/* --- PUBLIC ACCESS ROUTES (Không cần login vẫn xem được) --- */}
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


      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;