import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaClock, FaFire, FaUtensils } from 'react-icons/fa';

import myRecipeServiceApi from '../api/myRecipeServiceApi'; // Đảm bảo đúng tên file API bạn đã tạo (myRecipeServiceApi hay myRecipeServiceApi)
import './CSS/MyRecipes.css'; 

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // URL gốc trỏ vào folder storage/app/public
  const STORAGE_URL = 'http://localhost:8000/storage/';

  const fetchMyRecipes = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem('user') || localStorage.getItem('user_info'); 
      
      if (!storedUser) {
        alert("Bạn chưa đăng nhập!");
        navigate('/login');
        return;
      }

      const userInfo = JSON.parse(storedUser);
      const userId = userInfo.ma_nguoi_dung || userInfo.id;

      if (!userId) {
        alert("Không tìm thấy ID người dùng.");
        return;
      }

      // Gọi API
      const response = await myRecipeServiceApi.getDanhSachCongThuc(userId);

      if (response.data) {
         const list = response.data.data ? response.data.data : response.data;
         const finalList = Array.isArray(list) ? list : (list.data || []);
         setRecipes(finalList);
      }

    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchMyRecipes();
  }, [fetchMyRecipes]); 

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa công thức này không?")) return;

    try {
        await myRecipeServiceApi.delete(id);
        
        setRecipes(prevRecipes => prevRecipes.filter(recipe => {
            const currentId = recipe.id || recipe.ma_cong_thuc;
            return currentId !== id;
        }));
        
        alert("Đã xóa thành công!");
    } catch (error) {
        console.error("Lỗi khi xóa:", error);
        alert("Lỗi khi xóa! Có thể bạn không phải người tạo bài này.");
    }
  };
  
  if (loading) return <div className="loading-spinner">Đang tải công thức của bạn...</div>;

  return (
    <div className="my-recipes-container">
       <div className="my-recipes-header">
         <h2><FaUtensils /> Công Thức Của Tôi</h2>
         <button className="btn-add-new" onClick={() => navigate('/create-recipe')}>
           <FaPlus /> Thêm Mới
         </button>
       </div>

       <div className="my-recipes-list">
        {recipes.length === 0 ? (
          <div className="empty-state">
            <p>Bạn chưa đăng công thức nào.</p>
          </div>
        ) : (
          recipes.map((recipe) => {
             const recipeId = recipe.id || recipe.ma_cong_thuc;
             
             
             let imgSrc = 'https://placehold.co/600x400/e0e0e0/333333?text=No+Image';
             if (recipe.hinh_anh) {
                 if (recipe.hinh_anh.startsWith('http')) {
                     imgSrc = recipe.hinh_anh;
                 } else {
                    
                     const subFolder = recipe.hinh_anh.includes('recipes/covers') ? '' : 'recipes/covers/';
                     imgSrc = `${STORAGE_URL}${subFolder}${recipe.hinh_anh}`;
                 }
             }
            

            return (
              <div key={recipeId} className="recipe-row">
                 <div className="recipe-row-img">
                    <img 
                        src={imgSrc} 
                        alt={recipe.ten_mon} 
                        // Thêm xử lý lỗi nếu ảnh không load được thì hiện ảnh mặc định
                        onError={(e) => {e.target.onerror = null; e.target.src="https://placehold.co/600x400/e0e0e0/333333?text=No+Image"}}
                    />
                 </div>
                 
                 <div className="recipe-row-info">
                  
                    <Link to={`/recipe/${recipeId}`} className="recipe-name">{recipe.ten_mon}</Link>
                    <div className="recipe-meta">
                       <span><FaClock /> {recipe.thoi_gian || recipe.thoi_gian_nau + ' phút'}</span>
                       <span className="dot">•</span>
                       <span><FaFire /> {recipe.do_kho}</span>
                       <span className="dot">•</span>
                       <span>{new Date(recipe.ngay_dang || recipe.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                 </div>

                 <div className="recipe-row-actions">
                    <button className="btn-action edit" onClick={() => navigate(`/recipes/edit/${recipeId}`)}>
                        <FaEdit /> Sửa
                    </button>
                    <button className="btn-action delete" onClick={() => handleDelete(recipeId)}>
                        <FaTrash /> Xóa
                    </button>
                 </div>
              </div>
            )
          })
        )}
       </div>
    </div>
  );
};

export default MyRecipes;