import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Import Layout
import MainLayout from '../layouts/MainLayout';

// Import Pages (Giữ nguyên các import của bạn)
import Home from '../components/Home';
import Explore from '../components/Explore';
import MyRecipes from '../components/MyRecipes';
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

// --- 1. SỬA PROTECTED ROUTE ĐỂ NHẬN onLogout ---
// Nhận prop onLogout từ AppRouter truyền xuống
const ProtectedRoute = ({ children, isLoggedIn, onLogout }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  // QUAN TRỌNG: Truyền onLogout (hàm xịn có xóa localStorage) vào MainLayout
  return <MainLayout onLogout={onLogout}>{children}</MainLayout>;
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

// --- 2. SỬA APPROUTER ĐỂ NHẬN PROPS onLogout ---
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

      {/* --- PRIVATE ROUTES --- */}
      {/* 3. TRUYỀN onLogout VÀO TẤT CẢ PROTECTED ROUTE */}
      
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

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;