import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRouter from './routes/AppRouter'; // Import file Router vừa tạo

function App() {
  // State Global (Auth, Theme, etc.)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        {/* Chỉ gọi AppRouter và truyền props cần thiết */}
        <AppRouter 
          isLoggedIn={isLoggedIn} 
          setIsLoggedIn={setIsLoggedIn} 
        />
      </div>
    </Router>
  );
}

export default App;