import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaClock, FaUserFriends, FaFire, FaMapMarkerAlt, FaUtensils, 
  FaPlayCircle, FaCalendarAlt, FaStar, FaBookmark, FaListAlt, 
  FaTimes, FaPlus 
} from 'react-icons/fa';

// Import API
import { recipeDetailService } from '../api/recipeDetailServiceApi';
import { cookbookService } from '../services/cookbookService';

import './CSS/RecipeDetail.css';

const STORAGE_URL = 'http://localhost:8000/storage/';

const RecipeDetail = () => {
  // --- HOOKS ---
  const { id } = useParams();
  const navigate = useNavigate();
  
  // --- STATE DỮ LIỆU MÓN ---
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- STATE MODAL (TỪ CODE 2) ---
  const [showModal, setShowModal] = useState(false);
  const [myCookbooks, setMyCookbooks] = useState([]); 
  const [selectedCookbookId, setSelectedCookbookId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Helper: Chuyển độ khó
  const getDifficultyText = (level) => {
    const map = { 1: "Rất Dễ", 2: "Dễ", 3: "Vừa", 4: "Khó", 5: "Rất Khó" };
    return map[level] || "Vừa";
  };

  // --- 1. LOAD CHI TIẾT MÓN (LOGIC CODE 1 - CHI TIẾT HƠN) ---
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await recipeDetailService.getById(id);
        
        // console.log("🔍 API Response:", response); // Bật lên nếu cần debug

        if (response && response.data) {
            setRecipe(response.data);
        } else {
            console.error("⚠️ Cấu trúc dữ liệu không khớp:", response);
        }
      } catch (error) {
        console.error("❌ Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

  // --- 2. CÁC HÀM XỬ LÝ MODAL (TỪ CODE 2) ---
  
  // Mở modal và check đăng nhập
  const handleOpenModal = async () => {
      const token = localStorage.getItem('ACCESS_TOKEN');
      if (!token) {
          alert("Vui lòng đăng nhập để lưu món ăn!");
          navigate('/login');
          return;
      }

      setShowModal(true);
      
      // Nếu chưa có danh sách thì mới gọi API lấy BST
      if (myCookbooks.length === 0) {
          try {
              const data = await cookbookService.getAll();
              setMyCookbooks(data);
              // Mặc định chọn cái đầu tiên nếu có
              if (data.length > 0) setSelectedCookbookId(data[0].ma_bo_suu_tap);
          } catch (error) {
              console.error("Lỗi lấy danh sách BST:", error);
              if (error.response?.status === 401) {
                  navigate('/login');
              }
          }
      }
  };

  // Lưu vào cookbook
  const handleSaveToCookbook = async () => {
      if (!selectedCookbookId) {
          alert("Vui lòng chọn hoặc tạo bộ sưu tập mới!");
          return;
      }

      try {
          setIsSaving(true);
          await cookbookService.addRecipe(selectedCookbookId, id, ""); // Note để trống
          
          alert("Đã lưu thành công!");
          setShowModal(false);
      } catch (error) {
          const msg = error.response?.data?.message || "Có lỗi xảy ra!";
          alert("Lỗi: " + msg);
      } finally {
          setIsSaving(false);
      }
  };

  // Tạo nhanh cookbook mới trong modal
  const handleCreateQuick = async () => {
      const name = prompt("Nhập tên bộ sưu tập mới:");
      if (name) {
          try {
              const newCollection = await cookbookService.create(name);
              alert("Đã tạo mới!");
              // Reload lại danh sách và chọn cái mới tạo
              const all = await cookbookService.getAll();
              setMyCookbooks(all);
              
              if (newCollection && newCollection.ma_bo_suu_tap) {
                  setSelectedCookbookId(newCollection.ma_bo_suu_tap);
              } else {
                  setSelectedCookbookId(all[all.length - 1].ma_bo_suu_tap); 
              }
          } catch (e) {
              alert("Lỗi tạo mới");
          }
      }
  }

  // --- RENDER ---
  if (loading) return <div className="loading-spinner">Đang tải công thức...</div>;
  if (!recipe) return <div className="error-msg">Không tìm thấy công thức!</div>;

  // Xử lý hiển thị an toàn
  const coverImage = recipe.hinh_anh && recipe.hinh_anh.length > 0 
    ? `${STORAGE_URL}${recipe.hinh_anh[0].duong_dan}` 
    : 'https://via.placeholder.com/1200x600?text=No+Image';

  const mainVideo = recipe.video && recipe.video.length > 0 ? recipe.video[0] : null;
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

          {/* Mô tả & Actions */}
          <section className="section-block">
            <h2 className="section-title">Giới thiệu</h2>
            <p className="recipe-desc">{recipe.mo_ta}</p>
            
            {/* Hiển thị Tags */}
            {recipe.the && recipe.the.length > 0 && (
                <div className="recipe-tags-list">
                    {recipe.the.map(tag => (
                        <span key={tag.ma_the} className="tag-chip">#{tag.ten_the}</span>
                    ))}
                </div>
            )}
            
            {/* Link Video */}
            {mainVideo && (
              <a href={mainVideo.duong_dan_video} target="_blank" rel="noopener noreferrer" className="btn-video-link">
                <FaPlayCircle /> Xem Video Hướng Dẫn ({mainVideo.nen_tang})
              </a>
            )}

            {/* BUTTONS ACTION (Đã gắn hàm handleOpenModal) */}
            <div className="recipe-actions">
              <button className="btn-action btn-save" onClick={handleOpenModal}>
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

      {/* --- MODAL POPUP (TỪ CODE 2) --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box-save">
            <button className="btn-close-modal" onClick={() => setShowModal(false)}>
                <FaTimes />
            </button>
            
            <h3>Lưu công thức vào...</h3>
            
            {/* Preview nhỏ */}
            <div className="modal-preview">
                <img src={coverImage} alt="" />
                <p>{recipe.ten_mon}</p>
            </div>

            <div className="modal-form">
                <label>Chọn Bộ sưu tập:</label>
                
                <div className="select-container">
                    <select 
                        value={selectedCookbookId} 
                        onChange={(e) => setSelectedCookbookId(e.target.value)}
                        className="cookbook-select"
                    >
                        {myCookbooks.length === 0 ? (
                            <option value="">Bạn chưa có BST nào</option>
                        ) : (
                            myCookbooks.map(cb => (
                                <option key={cb.ma_bo_suu_tap} value={cb.ma_bo_suu_tap}>
                                    {cb.ten_bo_suu_tap}
                                </option>
                            ))
                        )}
                    </select>
                </div>

                <div className="modal-actions-link">
                    <span onClick={handleCreateQuick} className="link-create-new">
                        <FaPlus /> Tạo bộ sưu tập mới
                    </span>
                </div>

                <button 
                    className="btn-confirm-save" 
                    onClick={handleSaveToCookbook}
                    disabled={isSaving || myCookbooks.length === 0}
                >
                    {isSaving ? 'Đang lưu...' : 'Lưu lại'}
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RecipeDetail;