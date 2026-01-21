import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';


import AppRouter from './routes/AppRouter';
import AdminRouter from './routes/AdminRouter';
import authApi from './api/authApi';


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    return !!token;
  });


  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.log("Lỗi logout server hoặc token đã hết hạn");
    } finally {
      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.removeItem('USER');
      localStorage.removeItem('USER_INFO');
      localStorage.setItem('isLoggedIn', 'false'); // Cập nhật cả cái này nếu bạn dùng ở AppRouter
      setIsLoggedIn(false);
    }
  };

  return (
    <Router>
      <div className="App">

        <Routes>


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