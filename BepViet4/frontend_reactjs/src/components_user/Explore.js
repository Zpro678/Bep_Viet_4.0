// src/components/Explore.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipeService } from '../services/recipeService'; // Import service
import './CSS/Explore.css';

const Explore = () => {
  // 1. Khai báo State để quản lý dữ liệu động
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái đang tải
  const [error, setError] = useState(null);     // Trạng thái lỗi

  // 2. useEffect: Chạy 1 lần khi trang được load để gọi API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        // Gọi service lấy dữ liệu
        const data = await recipeService.getAll();
        setRecipes(data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải danh sách món ăn. Vui lòng thử lại sau.");
      } finally {
        setLoading(false); // Tắt loading dù thành công hay thất bại
      }
    };

    fetchRecipes();
  }, []);

  // 3. Hàm xử lý lưu (Gọi API thay vì chỉ alert)
  const handleSave = async (e, recipeId) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Gọi service lưu
    try {
      await recipeService.saveRecipe(recipeId);
      alert("Đã lưu món ăn thành công!");
    } catch (err) {
      alert("Lỗi khi lưu!");
    }
  };

  // Hàm helper để tối ưu ảnh (Thêm query param)
  const optimizeImage = (url) => {
    if (url.includes('unsplash.com')) {
      return `${url}?auto=format&fit=crop&w=500&q=60`;
    }
    return url;
  };

  // --- RENDER GIAO DIỆN ---
  
  if (loading) {
    // Bạn có thể thay bằng Spinner đẹp hơn sau này
    return <div className="explore-container" style={{textAlign: 'center', marginTop: '50px'}}>⏳ Đang tải món ngon...</div>;
  }

  if (error) {
    return <div className="explore-container" style={{textAlign: 'center', color: 'red'}}>{error}</div>;
  }

  return (
    <div className="explore-container">
      <h2 className="page-title">Khám phá món ngon 🍳</h2>
      
      <div className="explore-grid">
        {recipes.map((recipe) => (
          <Link 
            to={`/recipe/${recipe.id}`} 
            state={{ recipeData: recipe }} 
            key={recipe.id} 
            className="explore-card"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="explore-image-wrapper">
              <img 
                src={optimizeImage(recipe.image)} 
                alt={recipe.title} 
                className="explore-image" 
                loading="lazy"
                decoding="async"
              />
              
              <button className="save-btn" onClick={(e) => handleSave(e, recipe.id)}>🔖</button>
            </div>
            
            <div className="explore-info">
              <h3 className="explore-title">{recipe.title}</h3>
              <span className="explore-author">bởi {recipe.author}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Explore;