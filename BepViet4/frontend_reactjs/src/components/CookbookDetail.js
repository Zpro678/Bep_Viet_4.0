// src/components/CookbookDetail.js
import React, { useState, useEffect, useCallback } from 'react'; 
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaFire, FaTrashAlt, FaPlayCircle, FaPlus } from 'react-icons/fa'; 
import { cookbookService } from '../services/cookbookService';
import './CSS/CookbookDetail.css';

const CookbookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [cookbook, setCookbook] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 1. LOAD DỮ LIỆU ---
  const fetchDetail = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      
      const data = await cookbookService.getById(id);
      setCookbook(data);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail(false);
  }, [fetchDetail]);

  // --- 2. XỬ LÝ THÊM MÓN MỚI ---
  const handleAddRecipe = async () => {
    const recipeId = prompt("Nhập ID món ăn muốn thêm:");
    const note = prompt("Ghi chú (tùy chọn):", "");

    if (recipeId) {
      try {
        await cookbookService.addRecipe(id, recipeId, note);
        alert("Đã thêm món ăn thành công!");
        await fetchDetail(true); 
      } catch (error) {
        const msg = error.response?.data?.message || error.message;
        alert("Lỗi: " + msg);
      }
    }
  };

  // --- 3. XỬ LÝ XÓA MÓN ---
  const handleRemoveRecipe = async (recipeId) => {
    if (window.confirm("Bạn muốn xóa món này khỏi Cookbook?")) {
      try {
        await cookbookService.removeRecipe(id, recipeId);
        await fetchDetail(true);
      } catch (error) {
        alert("Lỗi khi xóa món: " + error.message);
      }
    }
  };

  // --- 4. HELPER ---
  const getRecipes = () => {
    if (!cookbook) return [];
    return cookbook.cong_thucs || cookbook.congThucs || []; 
  };

  if (loading) return <div className="loading-spinner">Đang tải chi tiết...</div>;
  if (!cookbook) return <div className="error-msg">Không tìm thấy Cookbook!</div>;

  const recipeList = getRecipes();

  return (
    <div className="cookbook-detail-container">
      {/* HEADER */}
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

          {/* SỬA: Chỉ hiện nút ở Header nếu danh sách KHÔNG rỗng */}
          {recipeList.length > 0 && (
            <div className="header-actions" style={{ marginTop: '15px' }}>
               <button className="btn-add-recipe" onClick={handleAddRecipe} style={{
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '1rem'
               }}>
                  <FaPlus /> Thêm món ăn
               </button>
            </div>
          )}

        </div>
      </div>

      {/* DANH SÁCH MÓN ĂN */}
      <div className="recipes-grid">
        {recipeList.length > 0 ? (
          recipeList.map((recipe) => (
            <div key={recipe.ma_cong_thuc} className="recipe-card-horizontal">
              <div className="recipe-img">
                <img 
                    src={recipe.hinh_anh || 'https://via.placeholder.com/300?text=Food'} 
                    alt={recipe.ten_mon} 
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
          ))
        ) : (
          /* SỬA: Hiện nút Thêm món ở đây khi danh sách rỗng */
          <div className="empty-recipes">
            <p>Cookbook này chưa có món ăn nào.</p>
            <button onClick={handleAddRecipe} className="btn-explore">Thêm món ngay</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookbookDetail;