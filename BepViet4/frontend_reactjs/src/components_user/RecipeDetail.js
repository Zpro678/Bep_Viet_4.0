import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FaClock, FaUserFriends, FaFire, FaMapMarkerAlt, FaUtensils, 
  FaPlayCircle, FaCalendarAlt, FaStar, FaBookmark, FaListAlt 
} from 'react-icons/fa';
import { recipeDetailService } from '../api/recipeDetailServiceApi';
import './CSS/RecipeDetail.css';

const STORAGE_URL = 'http://localhost:8000/storage/';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chuyển độ khó (1-5) sang chữ
  const getDifficultyText = (level) => {
    const map = { 1: "Rất Dễ", 2: "Dễ", 3: "Vừa", 4: "Khó", 5: "Rất Khó" };
    return map[level] || "Vừa";
  };

  // --- PHẦN QUAN TRỌNG NHẤT: XỬ LÝ DỮ LIỆU ---
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await recipeDetailService.getById(id);
        
        console.log("🔍 API Response:", response);

        if (response && response.data) {
            
            setRecipe(response.data);
        } else {
            console.error("Cấu trúc dữ liệu không khớp:", response);
        }

      } catch (error) {
        console.error("Lỗi tải dữ liệu hoặc ID không tồn tại:", error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="loading-spinner">Đang tải công thức...</div>;
  if (!recipe) return <div className="error-msg">Không tìm thấy công thức hoặc công thức đã bị xóa!</div>;

  // --- XỬ LÝ HIỂN THỊ AN TOÀN (CHỐNG LỖI CRASH) ---

  // 1. Lấy ảnh bìa an toàn (Dùng optional chaining ?.)
  const coverImage = recipe.hinh_anh && recipe.hinh_anh.length > 0 
    ? `${STORAGE_URL}${recipe.hinh_anh[0].duong_dan}` 
    : 'https://via.placeholder.com/1200x600?text=No+Image';

  // 2. Lấy video an toàn
  const mainVideo = recipe.video && recipe.video.length > 0 ? recipe.video[0] : null;

  // 3. Lấy thông tin người tạo an toàn
  const authorName = recipe.nguoi_tao?.ho_ten || recipe.nguoi_tao?.ten_dang_nhap || 'Ẩn danh';

  return (
    <div className="recipe-detail-container">
      
      {/* --- HEADER --- */}
      <div className="recipe-hero">
        <img src={coverImage} alt={recipe.ten_mon} className="recipe-hero-img" />
        <div className="recipe-overlay">
          <div className="hero-content">
            <div className="recipe-badges">
              {recipe.danh_muc && (
                <span className="badge-cat"><FaUtensils /> {recipe.danh_muc.ten_danh_muc}</span>
              )}
              {recipe.vung_mien && (
                <span className="badge-region"><FaMapMarkerAlt /> {recipe.vung_mien.ten_vung_mien}</span>
              )}
            </div>
            
            <h1 className="recipe-title">{recipe.ten_mon}</h1>
            
            <div className="recipe-meta-header">
              <div className="meta-user">
                <img src="https://via.placeholder.com/150" alt="Avatar" />
                <span>Đăng bởi: <strong>{authorName}</strong></span>
              </div>
              <span className="meta-date">
                <FaCalendarAlt /> {recipe.ngay_tao ? new Date(recipe.ngay_tao).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
              </span>
              <span className="meta-rating"><FaStar className="star-icon"/> 5.0/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- NỘI DUNG CHÍNH --- */}
      <div className="recipe-content-wrapper">
        <div className="recipe-main">
          
          {/* Thông số nhanh */}
          <div className="recipe-stats-bar">
            <div className="stat-item">
               <span className="stat-label">Thời gian</span>
               <strong><FaClock /> {recipe.thoi_gian_nau} phút</strong>
            </div>
            <div className="stat-item">
               <span className="stat-label">Khẩu phần</span>
               <strong><FaUserFriends /> {recipe.khau_phan} người</strong>
            </div>
            <div className="stat-item">
               <span className="stat-label">Độ khó</span>
               <strong><FaFire /> {getDifficultyText(recipe.do_kho)}</strong>
            </div>
          </div>

          {/* Mô tả & Video */}
          <section className="section-block">
            <h2 className="section-title">Giới thiệu</h2>
            <p className="recipe-desc">{recipe.mo_ta}</p>
            
            {/* Hiển thị Tags nếu có */}
            {recipe.the && recipe.the.length > 0 && (
                <div className="recipe-tags-list">
                    {recipe.the.map(tag => (
                        <span key={tag.ma_the} className="tag-chip">#{tag.ten_the}</span>
                    ))}
                </div>
            )}
            
            {mainVideo && (
              <a href={mainVideo.duong_dan_video} target="_blank" rel="noopener noreferrer" className="btn-video-link">
                <FaPlayCircle /> Xem Video Hướng Dẫn ({mainVideo.nen_tang})
              </a>
            )}

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

          {/* --- NGUYÊN LIỆU --- */}
          <section className="section-block">
            <h2 className="section-title">Nguyên liệu chuẩn bị</h2>
            <div className="ingredients-list">
              {recipe.nguyen_lieu?.map((item, index) => (
                <div key={item.ma_nguyen_lieu || index} className="ingredient-item">
                  <div className="ing-info">
                    <span className="ing-name">● {item.ten_nguyen_lieu}</span>
                    <span className="ing-type">({item.loai_nguyen_lieu})</span>
                  </div>
                  <div className="ing-measure">
                    {/* Access vào Pivot để lấy định lượng */}
                    <strong>{item.pivot?.dinh_luong}</strong> {item.pivot?.don_vi_tinh}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="divider"></div>

          {/* --- CÁC BƯỚC --- */}
          <section className="section-block">
            <h2 className="section-title">Cách làm chi tiết</h2>
            <div className="steps-list">
              {recipe.buoc_thuc_hien?.map((step) => (
                <div key={step.ma_buoc} className="step-card">
                  <div className="step-header">
                    <div className="step-number">Bước {step.so_thu_tu}</div>
                    {step.thoi_gian > 0 && (
                        <div className="step-time"><FaClock /> {step.thoi_gian} phút</div>
                    )}
                  </div>
                  
                  <div className="step-content">
                    <p className="step-desc">{step.noi_dung}</p>
                    
                    {/* Hiển thị ảnh bước (Kiểm tra kỹ mảng hinh_anh có rỗng không) */}
                    {step.hinh_anh && step.hinh_anh.length > 0 && (
                      <img 
                        src={`${STORAGE_URL}${step.hinh_anh[0].duong_dan}`} 
                        alt={`Bước ${step.so_thu_tu}`} 
                        className="step-image" 
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="divider"></div>

          {/* --- BÌNH LUẬN --- */}
          <section className="section-block">
            <h2 className="section-title">Bình luận ({recipe.binh_luan?.length || 0})</h2>
            <div className="comments-list">
                {recipe.binh_luan && recipe.binh_luan.length > 0 ? (
                    recipe.binh_luan.map((cmt) => (
                        <div key={cmt.ma_binh_luan || Math.random()} className="comment-item">
                             <div className="comment-body">
                                <p>{cmt.noi_dung}</p>
                             </div>
                        </div>
                    ))
                ) : (
                    <p className="no-comments">Chưa có bình luận nào.</p>
                )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;