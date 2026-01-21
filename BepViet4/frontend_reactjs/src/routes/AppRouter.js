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
import UserPublicProfile from '../components/UserPublicProfile';


// --- WRAPPERS & PROTECTED ROUTE ---

const ProtectedRoute = ({ children, isLoggedIn, setIsLoggedIn }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout onLogout={() => setIsLoggedIn(false)}>{children}</MainLayout>;
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

// --- COMPONENT ROUTER CHÍNH ---
const AppRouter = ({ isLoggedIn, setIsLoggedIn }) => {
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

      {/* 1. Trang chủ */}
      <Route path="/" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
          <Home />
        </ProtectedRoute>
      } />

      {/* 2. Khám phá */}
      <Route path="/explore" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
          <Explore />
        </ProtectedRoute>
      } />

      {/* 3. Chi tiết công thức */}
      <Route path="/recipe/:id" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
          <RecipeDetail />
        </ProtectedRoute>
      } />

      {/* 4. Hồ sơ cá nhân */}
      <Route path="/profile" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
          <UserProfile />
        </ProtectedRoute>
      } />

      {/* 5. Danh sách Bộ sưu tập */}
      <Route path="/my-cookbooks" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
          <MyCookbooks />
        </ProtectedRoute>
      } />

      {/* 6. Chi tiết Bộ sưu tập */}
      <Route path="/cookbook/:id" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
          <CookbookDetail />
        </ProtectedRoute>
      } />

      {/* 7. Lên kế hoạch ăn uống (MỚI) */}
      <Route path="/meal-planner" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
          <MealPlanner />
        </ProtectedRoute>
      } />

      <Route path="/shopping-list" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
          <ShoppingList />
        </ProtectedRoute>
      } />

      <Route path="/create-recipe" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
          <CreateRecipe />
        </ProtectedRoute>
      } />

      {/* 8. Xem hồ sơ người khác (Public View) */}
      <Route path="/user/:id" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
          {/* <div className="placeholder-page">
              <h2>Trang cá nhân người dùng (Public View)</h2>
           </div> */}
          <UserPublicProfile />
        </ProtectedRoute>
      } />

      {/* Route 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;