import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRouter from './routes/AppRouter';
import authApi from './api/authApi';

function App() {
  // Thay vì set cứng là false, ta dùng hàm callback để kiểm tra localStorage trước
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Lấy token từ bộ nhớ
    const token = localStorage.getItem('ACCESS_TOKEN');
    // Nếu có token -> trả về true (đã login)
    // Nếu không có (null) -> trả về false (chưa login)
    return !!token; 
  });

  // Hàm hỗ trợ logout (bạn nên truyền hàm này xuống AppRouter -> MainLayout)
const handleLogout = async () => {
      try {
        // VIỆC 1: Gọi API để Laravel xóa token trong Database (Optional nhưng nên làm)
        await authApi.logout(); 
    } catch (error) {
        console.log("Lỗi logout server hoặc token đã hết hạn từ trước");
    } finally {
        // VIỆC 2 (BẮT BUỘC): Xóa token trong túi của trình duyệt
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('USER');
        localStorage.removeItem('USER_INFO');
        
        // Cập nhật State để giao diện chuyển về Login ngay lập tức
        setIsLoggedIn(false);
    }
  };

  return (
    <Router>
      <div className="App">
        <AppRouter 
          isLoggedIn={isLoggedIn} 
          setIsLoggedIn={setIsLoggedIn} 
          // Bạn nên truyền thêm hàm logout xuống dưới để Layout xử lý
          onLogout={handleLogout}
        />
      </div>
    </Router>
  );
}

export default App;