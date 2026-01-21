import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Thêm useLocation
import { recipeService } from '../services/recipeService';
import './CSS/Explore.css';

const Explore = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy các tham số lọc từ thanh địa chỉ (URL)
  const location = useLocation();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);

        // Phân tích URL để lấy các tham số bộ lọc mà Navbar đã gửi lên
        const queryParams = new URLSearchParams(location.search);
        const params = {
          keyword: queryParams.get('keyword'),
          ma_vung_mien: queryParams.get('ma_vung_mien'),
          do_kho: queryParams.get('do_kho'),
          ma_danh_muc: queryParams.get('ma_danh_muc')
        };

        // Gọi API filterkhamPha thông qua service
        // Bạn nhớ cập nhật recipeService.filterKhamPha để gọi đúng API nhé
        const response = await recipeService.filterKhamPha(params);

        // Vì Backend dùng paginate(12), mảng công thức nằm trong response.data.data
        // (Hoặc tùy cách bạn bóc tách ở service, ở đây tôi giả định service trả về mảng data)
        setRecipes(response || []);

      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải danh sách món ăn phù hợp.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [location.search]); // Quan trọng: Chạy lại mỗi khi URL thay đổi (khi người dùng nhấn Lọc)

  const handleSave = async (e, recipeId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await recipeService.saveRecipe(recipeId);
      alert("Đã lưu món ăn thành công!");
    } catch (err) {
      alert("Lỗi khi lưu!");
    }
  };

  const optimizeImage = (url) => {
    if (!url) return 'https://via.placeholder.com/500x350?text=No+Image';
    if (url.includes('unsplash.com')) {
      return `${url}?auto=format&fit=crop&w=500&q=60`;
    }
    return url;
  };

  if (loading) {
    return <div className="explore-container" style={{ textAlign: 'center', marginTop: '50px' }}>⏳ Đang tìm món ngon cho bạn...</div>;
  }

  return (
    <div className="explore-container">
      <h2 className="page-title">Khám phá món ngon 🍳</h2>

      {/* Hiển thị thông báo nếu không có kết quả */}
      {!loading && recipes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <h3>😞 Không tìm thấy công thức phù hợp!</h3>
          <p>Hãy thử thay đổi từ khóa hoặc bộ lọc khác nhé.</p>
        </div>
      )}

      <div className="explore-grid">
        {recipes.map((recipe) => (
          <Link
            // Dùng ma_cong_thuc để khớp với DB
            to={`/recipe/${recipe.ma_cong_thuc || recipe.id}`}
            state={{ recipeData: recipe }}
            key={recipe.ma_cong_thuc || recipe.id}
            className="explore-card"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="explore-image-wrapper">
              <img
                src={optimizeImage(recipe.hinh_anh || recipe.image)}
                alt={recipe.ten_mon || recipe.title}
                className="explore-image"
                loading="lazy"
              />
              <button className="save-btn" onClick={(e) => handleSave(e, recipe.ma_cong_thuc || recipe.id)}>🔖</button>
            </div>

            <div className="explore-info">
              {/* Sử dụng tên cột từ DB: ten_mon */}
              <h3 className="explore-title">{recipe.ten_mon || recipe.title}</h3>
              <div className="explore-meta">
                <span className="explore-author">⭐ Độ khó: {recipe.do_kho}/5</span>
                <span className="explore-time">⏱️ {recipe.thoi_gian_nau} phút</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Explore;