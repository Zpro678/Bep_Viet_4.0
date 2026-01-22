import React, { useEffect, useState, useCallback } from 'react';
import {
  FaBookmark,
  FaCalendarAlt,
  FaClock,
  FaFire,
  FaListAlt,
  FaMapMarkerAlt,
  FaPlayCircle,
  FaPlus,
  FaStar,
  FaTimes,
  FaUserFriends,
  FaUtensils
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

import recipeDetailService from '../api/recipeDetailService';
import { cookbookService } from '../services/cookbookService';
import { ratingService } from '../services/ratingService';

import './CSS/RecipeDetail.css';

const STORAGE_URL = 'http://localhost:8000/storage/';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [myCookbooks, setMyCookbooks] = useState([]);
  const [selectedCookbookId, setSelectedCookbookId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [ratingStats, setRatingStats] = useState({
    trung_binh: 0,
    tong_so_luot: 0,
    diem_cua_toi: 0, 
  });
  const [hoverStar, setHoverStar] = useState(0); 
  const [isRating, setIsRating] = useState(false);

  const getDifficultyText = (level) => {
    const map = { 1: "Rất Dễ", 2: "Dễ", 3: "Vừa", 4: "Khó", 5: "Rất Khó" };
    return map[level] || "Vừa";
  };

  const fetchData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [detailRes, ratingRes] = await Promise.all([
        recipeDetailService.getById(id),
        ratingService.getRecipeRatingStats(id)
      ]);

      if (detailRes && detailRes.data) {
        setRecipe(detailRes.data);
      }

      if (ratingRes) {
        setRatingStats({
          trung_binh: ratingRes.trung_binh || 0,
          tong_so_luot: ratingRes.tong_so_luot || 0,
          diem_cua_toi: ratingRes.diem_cua_toi || 0
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData(true);
    window.scrollTo(0, 0);
  }, [fetchData]);

  const handleSubmitRating = async (starValue) => {
    const token = localStorage.getItem('ACCESS_TOKEN'); 
    if (!token) {
      if(window.confirm("Bạn cần đăng nhập để đánh giá. Đi đến trang đăng nhập?")) {
        navigate('/login');
      }
      return;
    }

    try {
      setIsRating(true);
      await ratingService.submitRating({
        ma_cong_thuc: id,
        so_sao: starValue
      });
      
      await fetchData(false);
      alert(`Cảm ơn! Bạn đã đánh giá ${starValue} sao.`);
    } catch (error) {
      alert("Lỗi khi gửi đánh giá: " + (error.response?.data?.message || "Vui lòng thử lại"));
    } finally {
      setIsRating(false);
      setHoverStar(0);
    }
  };

  const handleOpenModal = async () => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (!token) {
      alert("Vui lòng đăng nhập để lưu món ăn!");
      navigate('/login');
      return;
    }
    setShowModal(true);
    if (myCookbooks.length === 0) {
      try {
        const data = await cookbookService.getAll();
        setMyCookbooks(data);
        if (data.length > 0) setSelectedCookbookId(data[0].ma_bo_suu_tap);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSaveToCookbook = async () => {
    if (!selectedCookbookId) {
      alert("Vui lòng chọn hoặc tạo bộ sưu tập mới!");
      return;
    }
    try {
      setIsSaving(true);
      await cookbookService.addRecipe(selectedCookbookId, id, ""); 
      alert("Đã lưu thành công!");
      setShowModal(false);
    } catch (error) {
      const msg = error.response?.data?.message || "Có lỗi xảy ra!";
      alert("Lỗi: " + msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateQuick = async () => {
    const name = prompt("Nhập tên bộ sưu tập mới:");
    if (name) {
      try {
        const newCollection = await cookbookService.create(name);
        alert("Đã tạo mới!");
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

  if (loading) return <div className="loading-spinner">Đang tải công thức...</div>;
  if (!recipe) return <div className="error-msg">Không tìm thấy công thức!</div>;

  const coverImage = recipe.hinh_anh && recipe.hinh_anh.length > 0 
    ? `${STORAGE_URL}${recipe.hinh_anh[0].duong_dan}` 
    : 'https://via.placeholder.com/1200x600?text=No+Image';

  const mainVideo = recipe.video && recipe.video.length > 0 ? recipe.video[0] : null;
  const authorName = recipe.nguoi_tao?.ho_ten || recipe.nguoi_tao?.ten_dang_nhap || 'Ẩn danh';

  return (
    <div className="recipe-detail-container">
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
              <span className="meta-rating">
                  <FaStar className="star-icon-fixed"/> {ratingStats.trung_binh}/5 ({ratingStats.tong_so_luot} đánh giá)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="recipe-content-wrapper">
        <div className="recipe-main">
          
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

          <section className="rating-section">
              <h2 className="section-title" style={{fontSize: '18px', marginBottom:'15px'}}>
                {ratingStats.diem_cua_toi > 0 ? "Đánh giá của bạn" : "Đánh giá món ăn này"}
              </h2>
              <div className={`star-rating-wrapper ${ratingStats.diem_cua_toi > 0 ? 'rated' : ''}`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                          key={star}
                          className={`star-item ${star <= (hoverStar || ratingStats.diem_cua_toi) ? 'active' : ''} ${ratingStats.diem_cua_toi > 0 ? 'read-only' : ''}`}
                          onMouseEnter={() => ratingStats.diem_cua_toi === 0 && setHoverStar(star)}
                          onMouseLeave={() => ratingStats.diem_cua_toi === 0 && setHoverStar(0)}
                          onClick={() => !isRating && ratingStats.diem_cua_toi === 0 && handleSubmitRating(star)}
                          title={ratingStats.diem_cua_toi > 0 ? `Bạn đã đánh giá ${ratingStats.diem_cua_toi} sao` : `Đánh giá ${star} sao`}
                      />
                  ))}
                  
                  {isRating ? (
                      <span className="rating-text">Đang gửi...</span>
                  ) : (
                      <span className="rating-text">
                          {ratingStats.diem_cua_toi > 0 
                              ? `Bạn đã đánh giá ${ratingStats.diem_cua_toi}/5 sao` 
                              : "Hãy để lại đánh giá của bạn"}
                      </span>
                  )}
              </div>
          </section>

          <section className="section-block">
            <h2 className="section-title">Giới thiệu</h2>
            <p className="recipe-desc">{recipe.mo_ta}</p>
            
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
              <button className="btn-action btn-save" onClick={handleOpenModal}>
                <FaBookmark /> Thêm vào Bộ Sưu Tập
              </button>
              <button className="btn-action btn-menu">
                <FaListAlt /> Thêm vào Thực Đơn
              </button>
            </div>
          </section>

          <div className="divider"></div>

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

          <section className="section-block">
            <h2 className="section-title">Cách làm chi tiết</h2>
            <div className="steps-list">
              {recipe.buoc_thuc_hien?.map((step) => (
                <div key={step.ma_buoc} className="step-card">
                  <div className="step-header">
                    <div className="step-number" style={{color:'white'}}>Bước {step.so_thu_tu}</div>
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box-save">
            <button className="btn-close-modal" onClick={() => setShowModal(false)}>
                <FaTimes />
            </button>
            
            <h3>Lưu công thức vào...</h3>
            
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