import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import './App.css';

import AppRouter from './routes/AppRouter';       
import AdminRouter from './routes/AdminRouter';  
import authApi from './api/authApi';

function App() {
  
  // 1. Khởi tạo state dựa trên việc có TOKEN hay không
  // !!token sẽ trả về true nếu có token, false nếu không có
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('access_token');
  });

  const handleLogout = async () => {
    try {
        await authApi.logout(); 
    } catch (error) {
        console.log("Lỗi logout server hoặc token đã hết hạn");
    } finally {
        // 2. Chỉ cần xóa Token và User info là đủ
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        
        // Cập nhật State để giao diện tự chuyển về trang Login ngay lập tức
        setIsLoggedIn(false);
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          
          {/* Router cho Admin */}
          <Route 
            path="/admin/*" 
            element={
              <AdminRouter 
                isLoggedIn={isLoggedIn} 
                setIsLoggedIn={setIsLoggedIn} 
                onLogout={handleLogout}       
              />
            }
          />

          {/* Router cho User thường */}
          <Route 
            path="/*" 
            element={
              <AppRouter 
                isLoggedIn={isLoggedIn} 
                setIsLoggedIn={setIsLoggedIn} 
                onLogout={handleLogout}
              />
            } 
          />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;