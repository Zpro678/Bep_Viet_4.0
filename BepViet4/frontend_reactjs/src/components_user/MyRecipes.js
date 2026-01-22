import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaClock, FaFire, FaUtensils } from 'react-icons/fa';

import createRecipeService from '../api/createRecipeServiceApi'; 
import myRecipeServiceApi from '../api/myRecipeServiceApi';
import './CSS/MyRecipes.css'; 

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const STORAGE_URL = 'http://localhost:8000/storage/';

  const fetchMyRecipes = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem('USER');
      
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

      const response = await myRecipeServiceApi.getDanhSachCongThuc(userId);

      console.log("🟢 Response full từ API:", response);
      console.log("🟢 response.data:", response.data);

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
    
    const isConfirmed = window.confirm(
        "Bạn có chắc chắn muốn xóa công thức này?\n\nCông thức sẽ được chuyển vào thùng rác và tự động xóa vĩnh viễn sau 30 ngày."
    );

    if (!isConfirmed) return;

    try {
        
        await createRecipeService.delete(id);
        setRecipes(prevRecipes => prevRecipes.filter(recipe => {
            const currentId = recipe.id || recipe.ma_cong_thuc;
            return currentId !== id;
        }));
        
        alert("Đã chuyển công thức vào thùng rác thành công!");
    } catch (error) {
        console.error("Lỗi khi xóa:", error);
       
        const message = error.response?.data?.message || "Lỗi khi xóa! Có thể bạn không phải người tạo bài này.";
        alert(message);
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
                 // Xử lý đường dẫn ảnh linh hoạt
                 if (recipe.hinh_anh.startsWith('http')) {
                     imgSrc = recipe.hinh_anh;
                 } else {
                     // Kiểm tra xem backend trả về có kèm folder không
                     const cleanPath = recipe.hinh_anh.replace(/^\/+/, ''); // Xóa dấu / ở đầu nếu có
                     imgSrc = `${STORAGE_URL}${cleanPath}`;
                 }
             }

            return (
              <div key={recipeId} className="recipe-row">
                 <div className="recipe-row-img">
                    <img 
                        src={imgSrc} 
                        alt={recipe.ten_mon} 
                        onError={(e) => {e.target.onerror = null; e.target.src="https://placehold.co/600x400/e0e0e0/333333?text=No+Image"}}
                    />
                 </div>
                 
                 <div className="recipe-row-info">
                    <Link to={`/recipe/${recipeId}`} className="recipe-name">{recipe.ten_mon}</Link>
                    <div className="recipe-meta">
                       <span><FaClock /> {recipe.thoi_gian || recipe.thoi_gian_nau} phút</span>
                       <span className="dot">•</span>
                       <span><FaFire /> Độ khó: {recipe.do_kho}/5</span>
                       <span className="dot">•</span>
                       <span>{new Date(recipe.ngay_dang || recipe.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                 </div>

                 <div className="recipe-row-actions">
                    <button className="btn-action edit" onClick={() => navigate(`/edit-recipe/${recipeId}`)}>
                        <FaEdit /> Sửa
                    </button>
                    {/* Nút Xóa gọi hàm handleDelete ở trên */}
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