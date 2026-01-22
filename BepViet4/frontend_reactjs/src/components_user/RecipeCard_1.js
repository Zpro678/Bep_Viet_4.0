import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  
  // Dữ liệu thật có thể không có sẵn likes nên để mặc định là 0
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(recipe.luot_thich || 0);

  const handleDetailClick = () => {
    // API trả về 'id', dùng recipe.id để chuyển trang
    navigate(`/recipe/${recipe.id}`);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    const newStatus = !isLiked;
    setIsLiked(newStatus);
    setLikes(prev => newStatus ? prev + 1 : prev - 1);
  };

  // Kiểm tra dữ liệu recipe tránh lỗi trắng trang
  if (!recipe) return null;

  return (
    <div className="post-card">
      {/* Header công thức */}
      <div className="post-header">
        <img
          // Nếu recipe không có author trực tiếp (vì ở Profile đã biết của ai) 
          // thì có thể lấy avatar mặc định hoặc truyền từ ngoài vào
          src={recipe.author?.avatar || 'https://via.placeholder.com/50'}
          alt=""
          className="avatar"
          onClick={(e) => {
            e.stopPropagation();
            if (recipe.ma_nguoi_dung) navigate(`/user/${recipe.ma_nguoi_dung}`);
          }}
        />
        <div className="user-info">
          <span>{recipe.ten_mon}</span>
          <span style={{ fontSize: '12px', color: '#888' }}>
             {recipe.thoi_gian} • Độ khó: {recipe.do_kho}
          </span>
        </div>
      </div>

      {/* Phần nội dung text */}
      <div className="post-caption" onClick={handleDetailClick} style={{ cursor: 'pointer' }}>
        <div style={{ color: '#444', fontSize: '14px' }}>{recipe.mo_ta_ngan}</div>
      </div>

      {/* Ảnh công thức lấy từ trường hinh_anh của API */}
      <img 
        src={recipe.hinh_anh} 
        className="post-image" 
        alt={recipe.ten_mon}
        onClick={handleDetailClick} 
        style={{ cursor: 'pointer', width: '100%', objectFit: 'cover' }}
      />

      {/* Nút Like/Comment*/}
      <div className="post-actions">
        <span onClick={handleLike} style={{ cursor: 'pointer' }}>
          {isLiked ? '❤️' : '🤍'} {likes}
        </span>
        <span onClick={handleDetailClick} style={{ cursor: 'pointer' }}>
          💬 Xem chi tiết
        </span>
      </div>
    </div>
  );
};

export default RecipeCard;