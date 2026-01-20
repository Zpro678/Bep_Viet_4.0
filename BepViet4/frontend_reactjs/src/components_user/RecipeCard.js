import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaRegComment, FaShare } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // 1. Dùng Link thay vì useNavigate cho ổn định

const RecipeCard = ({ recipe }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(recipe.likes || 0);

  // Hàm xử lý Like (giữ nguyên)
  const handleLikeClick = (e) => {
    e.preventDefault(); // Chặn Link kích hoạt
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  // Đảm bảo có ID, nếu không có thì không tạo link để tránh lỗi
  const detailLink = recipe.id ? `/recipe/${recipe.id}` : '#';

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full overflow-hidden hover:shadow-md transition-shadow">
      
      {/* HEADER: Avatar User */}
      <div className="flex items-center p-3">
        <img src={recipe.author.avatar} alt={recipe.author.name} className="w-10 h-10 rounded-full mr-3 border border-gray-300" />
        <span className="font-semibold text-sm text-gray-900">{recipe.author.name}</span>
      </div>

      {/* --- PHẦN CLICK ĐƯỢC ĐỂ CHUYỂN TRANG (Ảnh & Nội dung) --- */}
      {/* Chúng ta dùng thẻ Link bọc phần nội dung lại. state={{ recipeData: recipe }} dùng để truyền dữ liệu */}
      <Link to={detailLink} state={{ recipeData: recipe }} className="block group">
        
        {/* Ảnh món ăn */}
        <div className="w-full h-[400px] overflow-hidden bg-gray-100 relative">
           {/* Thêm lớp phủ mờ khi hover để người dùng biết có thể bấm vào */}
           <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity z-10" />
           <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>

        {/* Nội dung text */}
        <div className="p-4 pb-0">
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
            {recipe.title}
          </h3>
          <p className="text-gray-700 text-sm line-clamp-2 mb-3">
            {recipe.description}
          </p>
        </div>
      </Link>

      {/* FOOTER: Các nút bấm (Nằm NGOÀI thẻ Link để tránh xung đột) */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-4 text-2xl mb-2">
          <button onClick={handleLikeClick} className="transition-transform active:scale-110 hover:bg-gray-100 p-1 rounded-full">
            {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-700" />}
          </button>
          <button className="hover:bg-gray-100 p-1 rounded-full"><FaRegComment className="text-gray-700" /></button>
          <button className="ml-auto hover:bg-gray-100 p-1 rounded-full"><FaShare className="text-gray-700" /></button>
        </div>
        <div className="font-semibold text-sm">{likeCount.toLocaleString()} lượt thích</div>
      </div>

    </div>
  );
};

export default RecipeCard;