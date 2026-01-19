// src/components/CookbookDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaFire, FaTrashAlt, FaPlayCircle } from 'react-icons/fa';
import { cookbookService } from '../services/cookbookService';
import './CSS/CookbookDetail.css'; // Đã đổi tên file CSS

const CookbookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Đổi tên state từ 'collection' sang 'cookbook' cho chuẩn
  const [cookbook, setCookbook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load dữ liệu
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await cookbookService.getById(id);
        setCookbook(data);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // Xử lý xóa món khỏi Cookbook
  const handleRemoveRecipe = async (recipeId) => {
    if (window.confirm("Bạn muốn xóa món này khỏi Cookbook?")) {
      await cookbookService.removeRecipe(id, recipeId);
      
      // Cập nhật UI
      setCookbook(prev => ({
        ...prev,
        recipes: prev.recipes.filter(r => r.id !== recipeId)
      }));
    }
  };

  if (loading) return <div className="loading-spinner">Đang tải chi tiết...</div>;
  if (!cookbook) return <div className="error-msg">Không tìm thấy Cookbook!</div>;

  return (
    <div className="cookbook-detail-container">
      {/* HEADER */}
      <div className="detail-header">
        <button className="btn-back" onClick={() => navigate('/my-cookbooks')}>
          <FaArrowLeft /> Quay lại
        </button>
        
        <div className="header-content">
          <h1 className="cookbook-title">{cookbook.title}</h1>
          <p className="cookbook-desc">{cookbook.description}</p>
          <div className="cookbook-meta">
            <span>📅 Tạo ngày: {cookbook.created_at}</span>
            <span>🍲 Số lượng món: {cookbook.recipes?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* DANH SÁCH MÓN ĂN */}
      <div className="recipes-grid">
        {cookbook.recipes && cookbook.recipes.length > 0 ? (
          cookbook.recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card-horizontal">
              <div className="recipe-img">
                <img src={recipe.image} alt={recipe.name} />
                <div className="play-overlay">
                   <Link to={`/recipe/${recipe.id}`}><FaPlayCircle /></Link>
                </div>
              </div>
              
              <div className="recipe-info">
                <Link to={`/recipe/${recipe.id}`} className="recipe-name">
                  {recipe.name}
                </Link>
                
                <div className="recipe-tags">
                  <span className="tag-time"><FaClock /> {recipe.time}</span>
                  <span className="tag-diff"><FaFire /> {recipe.difficulty}</span>
                </div>
                
                <div className="recipe-actions">
                  <button 
                    className="btn-remove-recipe"
                    onClick={() => handleRemoveRecipe(recipe.id)}
                    title="Xóa khỏi Cookbook"
                  >
                    <FaTrashAlt /> Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-recipes">
            <p>Cookbook này chưa có món ăn nào.</p>
            <Link to="/explore" className="btn-explore">Khám phá món ngon ngay</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookbookDetail;