// src/components/CookbookDetail.js
import React, { useState, useEffect, useCallback } from 'react'; 
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaFire, FaTrashAlt, FaPlayCircle, FaPlus } from 'react-icons/fa'; 
import { cookbookService } from '../services/cookbookService';
import './CSS/CookbookDetail.css';

const CookbookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const STORAGE_URL = "http://localhost:8000/storage/";
  const [cookbook, setCookbook] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH DỮ LIỆU ---
  const fetchDetail = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      
      const data = await cookbookService.getById(id);
      setCookbook(data);
    } catch (error) {
      console.error("Lỗi:", error);
      if (error.response && error.response.status === 401) {
          alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          localStorage.removeItem('ACCESS_TOKEN');
          navigate('/login');
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        alert("Vui lòng đăng nhập để xem chi tiết!");
        navigate('/login');
        return;
    }

    fetchDetail(false);
  }, [fetchDetail, navigate]);

  const handleAddRecipe = () => {
    navigate('/explore');
  };


  const handleRemoveRecipe = async (recipeId) => {
    if (window.confirm("Bạn muốn xóa món này khỏi Cookbook?")) {
      try {
        await cookbookService.removeRecipe(id, recipeId);
        await fetchDetail(true); // Load lại ngầm
      } catch (error) {
        if (error.response && error.response.status === 401) {
            navigate('/login');
            return;
        }
        alert("Lỗi khi xóa món: " + error.message);
      }
    }
  };

  const getRecipes = () => {
    if (!cookbook) return [];
    return cookbook.cong_thucs || cookbook.congThucs || []; 
  };

  if (loading) return <div className="loading-spinner">Đang tải chi tiết...</div>;
  if (!cookbook) return <div className="error-msg">Không tìm thấy Cookbook!</div>;

  const recipeList = getRecipes();
  console.log("Cookbook detail - recipes:", recipeList);

  return (
    <div className="cookbook-detail-container">
      <div className="detail-header">
        <button className="btn-back" onClick={() => navigate('/my-cookbooks')}>
          <FaArrowLeft /> Quay lại
        </button>
        
        <div className="header-content">
          <h1 className="cookbook-title">{cookbook.ten_bo_suu_tap}</h1>
          <p className="cookbook-desc">
             {cookbook.mo_ta || "Bộ sưu tập các món ngon yêu thích."}
          </p>

          <div className="cookbook-meta">
            <span>📅 Tạo ngày: {new Date(cookbook.created_at).toLocaleDateString('vi-VN')}</span>
            <span>🍲 Số lượng món: {recipeList.length}</span>
          </div>

          {/* CHỈ HIỆN NÚT Ở HEADER NẾU ĐÃ CÓ MÓN ĂN (recipeList.length > 0) */}
          {recipeList.length > 0 && (
            <div className="header-actions" style={{ marginTop: '15px' }}>
               <button className="btn-add-recipe" onClick={handleAddRecipe} style={{
                  padding: '10px 20px',
                  backgroundColor: '#f97316', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px rgba(249, 115, 22, 0.3)'
               }}>
                  <FaPlus /> Thêm món mới 
               </button>
            </div>
          )}

        </div>
      </div>

      <div className="recipes-grid">
        {recipeList.length > 0 ? (
          recipeList.map((recipe) => {
            // --- 2. LOGIC XỬ LÝ HÌNH ẢNH CỦA BẠN TẠI ĐÂY ---
            let imgSrc = 'https://placehold.co/300x300?text=No+Image';
            
            if (recipe.hinh_anh && recipe.hinh_anh.length > 0) {
                // Vì hinh_anh là mảng, ta lấy phần tử đầu tiên [0] và thuộc tính duong_dan
                const path = recipe.hinh_anh[0].duong_dan;

                if (path.startsWith('http')) {
                    imgSrc = path;
                } else {
                    // Kiểm tra xem chuỗi đã có recipes/covers chưa
                    const subFolder = path.includes('recipes/covers') ? '' : 'recipes/covers/';
                    imgSrc = `${STORAGE_URL}${subFolder}${path}`;
                }
            }

            return (
              <div key={recipe.ma_cong_thuc} className="recipe-card-horizontal">
                <div className="recipe-img">
                  <img 
                     src={imgSrc} 
                     alt={recipe.ten_mon} 
                     // Xử lý nếu link ảnh die
                     onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/300x300?text=Error+Image';
                     }}
                  />
                  <div className="play-overlay">
                     <Link to={`/recipe/${recipe.ma_cong_thuc}`}><FaPlayCircle /></Link>
                  </div>
                </div>
                
                <div className="recipe-info">
                  <Link to={`/recipe/${recipe.ma_cong_thuc}`} className="recipe-name">
                    {recipe.ten_mon}
                  </Link>
                  
                  <div className="recipe-tags">
                    <span className="tag-time">
                      <FaClock /> {recipe.thoi_gian_nau || 0} phút
                    </span>
                    <span className="tag-diff">
                      <FaFire /> Độ khó: {recipe.do_kho || 1}/5
                    </span>
                  </div>

                  {recipe.pivot && recipe.pivot.ghi_chu && (
                      <p className="recipe-note" style={{fontSize: '0.9rem', color: '#666', fontStyle: 'italic'}}>
                          📝 {recipe.pivot.ghi_chu}
                      </p>
                  )}
                  
                  <div className="recipe-actions">
                    <button 
                      className="btn-remove-recipe"
                      onClick={() => handleRemoveRecipe(recipe.ma_cong_thuc)}
                      title="Xóa khỏi Cookbook"
                    >
                      <FaTrashAlt /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-recipes">
            <p>Cookbook này chưa có món ăn nào.</p>
            <button onClick={handleAddRecipe} className="btn-explore">Tìm món ngay</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookbookDetail;