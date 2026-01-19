import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FaClock, FaUserFriends, FaFire, FaMapMarkerAlt, FaUtensils, 
  FaPlayCircle, FaCalendarAlt, FaStar, FaBookmark, FaListAlt 
} from 'react-icons/fa';
import { recipeDetailService } from '../services/recipeDetailService';
import './CSS/RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load dữ liệu
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await recipeDetailService.getById(id);
        setRecipe(data);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="loading-spinner">Đang tải công thức...</div>;
  if (!recipe) return <div className="error-msg">Không tìm thấy công thức!</div>;

  return (
    <div className="recipe-detail-container">
      
      {/* 1. HEADER & INFO (Bảng CongThuc) */}
      <div className="recipe-hero">
        <img src={recipe.image} alt={recipe.title} className="recipe-hero-img" />
        <div className="recipe-overlay">
          <div className="hero-content">
            <div className="recipe-badges">
              <span className="badge-cat"><FaUtensils /> {recipe.category_name}</span>
              <span className="badge-region"><FaMapMarkerAlt /> {recipe.region_name}</span>
            </div>
            
            <h1 className="recipe-title">{recipe.title}</h1>
            
            <div className="recipe-meta-header">
              <div className="meta-user">
                <img src={recipe.author?.avatar} alt="Author" />
                <span>Đăng bởi: <strong>{recipe.author?.name}</strong></span>
              </div>
              <span className="meta-date"><FaCalendarAlt /> {new Date(recipe.created_at).toLocaleDateString('vi-VN')}</span>
              <span className="meta-rating"><FaStar className="star-icon"/> {recipe.average_rating}/5</span>
            </div>
          </div>
        </div>
      </div>

      <div className="recipe-content-wrapper">
        <div className="recipe-main">
          
          {/* Thông số nhanh */}
          <div className="recipe-stats-bar">
            <div className="stat-item">
               <span className="stat-label">Thời gian</span>
               <strong><FaClock /> {recipe.cooking_time} phút</strong>
            </div>
            <div className="stat-item">
               <span className="stat-label">Khẩu phần</span>
               <strong><FaUserFriends /> {recipe.servings} người</strong>
            </div>
            <div className="stat-item">
               <span className="stat-label">Độ khó</span>
               <strong><FaFire /> {recipe.difficulty}</strong>
            </div>
          </div>

          {/* Mô tả & Video */}
          <section className="section-block">
            <h2 className="section-title">Giới thiệu</h2>
            <p className="recipe-desc">{recipe.description}</p>
            
            {recipe.video_url && (
              <a href={recipe.video_url} target="_blank" rel="noopener noreferrer" className="btn-video-link">
                <FaPlayCircle /> Xem Video Hướng Dẫn
              </a>
            )}

            {/* Nút chức năng: Thêm vào BST / Thực đơn */}
            <div className="recipe-actions">
              <button className="btn-action btn-save">
                <FaBookmark /> Thêm vào Bộ Sưu Tập
              </button>
              <button className="btn-action btn-menu">
                <FaListAlt /> Thêm vào Thực Đơn
              </button>
            </div>
          </section>

          <div className="divider"></div>

          {/* 2. NGUYÊN LIỆU (Bảng CongThuc_NguyenLieu + NguyenLieu) */}
          <section className="section-block">
            <h2 className="section-title">Nguyên liệu chuẩn bị</h2>
            <div className="ingredients-list">
              {recipe.ingredients?.map((item, index) => (
                <div key={index} className="ingredient-item">
                  <div className="ing-info">
                    <span className="ing-name">● {item.name}</span>
                    <span className="ing-type">({item.type})</span>
                  </div>
                  <div className="ing-measure">
                    <strong>{item.quantity}</strong> {item.unit}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="divider"></div>

          {/* 3. CÁC BƯỚC THỰC HIỆN (Bảng BuocThucHien) */}
          <section className="section-block">
            <h2 className="section-title">Cách làm chi tiết</h2>
            <div className="steps-list">
              {recipe.steps?.map((step) => (
                <div key={step.step_number} className="step-card">
                  <div className="step-header">
                    <div className="step-number">Bước {step.step_number}</div>
                    <div className="step-time"><FaClock /> {step.time_per_step} phút</div>
                  </div>
                  
                  <div className="step-content">
                    <p className="step-desc">{step.instruction}</p>
                    {step.image && (
                      <img src={step.image} alt={`Bước ${step.step_number}`} className="step-image" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="divider"></div>

          {/* 4. BÌNH LUẬN & ĐÁNH GIÁ (Bảng BinhLuan & DanhGia) */}
          <section className="section-block">
            <h2 className="section-title">Bình luận & Đánh giá ({recipe.total_reviews})</h2>
            
            {/* Form bình luận (UI Only) */}
            <div className="comment-form">
              <textarea placeholder="Chia sẻ cảm nghĩ của bạn..." rows="3"></textarea>
              <button className="btn-submit-comment">Gửi bình luận</button>
            </div>

            {/* Danh sách bình luận */}
            <div className="comments-list">
              {recipe.comments?.map((cmt) => (
                <div key={cmt.id} className="comment-item">
                  <img src={cmt.user_avatar} alt={cmt.user_name} className="comment-avatar" />
                  <div className="comment-body">
                    <div className="comment-header">
                      <strong>{cmt.user_name}</strong>
                      {cmt.rating > 0 && <span className="comment-rating">⭐ {cmt.rating}</span>}
                    </div>
                    <p className="comment-content">{cmt.content}</p>
                    <span className="comment-date">{new Date(cmt.created_at).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;