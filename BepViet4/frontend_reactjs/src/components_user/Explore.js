import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import feedApi from '../api/explore_feedApi';
import './CSS/Explore.css';

const Explore = () => {
  // 1. State dữ liệu
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 12 món 1 trang

  const user = JSON.parse(localStorage.getItem('USER'));
  const userId = user?.ma_nguoi_dung;

  // 3. Gọi API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        // userId có thể là null (khách) hoặc ID (user), API vẫn chạy tốt
        const response = await feedApi.getExploreRecipes(userId); 

        console.log("🔍 API Response:", response);

        let rawList = [];
        // (Giữ nguyên đoạn xử lý data của bạn ở đây...)
        if (response?.data?.data && Array.isArray(response.data.data)) {
            rawList = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
            rawList = response.data;
        } else if (Array.isArray(response)) {
            rawList = response;
        } else if (response?.data && typeof response.data === 'object' && Array.isArray(response.data)) {
            rawList = response.data;
        }

        const mappedRecipes = rawList.map(item => ({
          id: item.ma_cong_thuc,
          title: item.ten_mon,
          author: item.ten_nguoi_tao,
          image: (item.hinh_anh && item.hinh_anh.startsWith('http')) 
                 ? item.hinh_anh 
                 : `http://localhost:8000/storage/${item.hinh_anh}`,
          originalData: item
        }));

        setRecipes(mappedRecipes);
        setCurrentPage(1); 
      } catch (err) {
        console.error('❌ Lỗi:', err);
        setError('Không thể tải danh sách món ăn.');
      } finally {
        setLoading(false); // Dù lỗi hay không cũng phải tắt loading
      }
    };

    // --- SỬA Ở ĐÂY: Bỏ if(userId), gọi luôn! ---
    fetchRecipes(); 
    
  }, [userId]);

  const handleSave = (e, recipeId) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Đã lưu công thức #${recipeId}`);
  };

  // 4. Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecipes = recipes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(recipes.length / itemsPerPage);

  // Hàm chuyển trang
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) paginate(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) paginate(currentPage - 1);
  };

  // --- HÀM RENDER SỐ TRANG (LOGIC MỚI Ở ĐÂY) ---
  const renderPaginationButtons = () => {
    const pageNumbers = [];

    // Nếu ít trang (<= 5) thì hiện hết
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Nếu nhiều trang (> 5), xử lý rút gọn
      if (currentPage <= 3) {
        // Đang ở đầu: 1 2 3 4 ... Cuối
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Đang ở cuối: 1 ... 17 18 19 20
        pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Đang ở giữa: 1 ... 9 10 11 ... 20
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    // Map mảng pageNumbers thành nút HTML
    return pageNumbers.map((number, index) => {
      if (number === '...') {
        return <span key={`dots-${index}`} className="pagination-dots">...</span>;
      }
      return (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`page-btn ${currentPage === number ? 'active' : ''}`}
        >
          {number}
        </button>
      );
    });
  };
  // ---------------------------------------------

  // 5. Render giao diện
  if (loading) {
    return (
      <div className="explore-container" style={{ textAlign: 'center', marginTop: 50 }}>
        ⏳ Đang tải món ngon...
      </div>
    );
  }

  if (error) {
    return (
      <div className="explore-container" style={{ textAlign: 'center', color: 'red' }}>
        {error}
      </div>
    );
  }

  return (
    <div className="explore-container">
      <h2 className="page-title">Khám phá món ngon 🍳</h2>

      <div className="explore-grid">
        {currentRecipes.length > 0 ? (
          currentRecipes.map(recipe => (
            <Link
              to={`/recipe/${recipe.id}`}
              state={{ recipeData: recipe.originalData }}
              key={recipe.id}
              className="explore-card"
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div className="explore-image-wrapper">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="explore-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/600x400?text=No+Image';
                  }}
                />
                <button
                  className="save-btn"
                  onClick={(e) => handleSave(e, recipe.id)}
                >
                  🔖
                </button>
              </div>

              <div className="explore-info">
                <h3 className="explore-title">{recipe.title}</h3>
                <span className="explore-author">bởi {recipe.author}</span>
              </div>
            </Link>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            📭 Chưa có công thức nào
          </div>
        )}
      </div>

      {/* UI Phân trang */}
      {recipes.length > itemsPerPage && (
        <div className="pagination">
          <button 
            onClick={goToPrevPage} 
            disabled={currentPage === 1}
            className="page-btn arrow-btn"
          >
            &laquo;
          </button>

          {/* GỌI HÀM RENDER LOGIC MỚI TẠI ĐÂY */}
          {renderPaginationButtons()}

          <button 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages}
            className="page-btn arrow-btn"
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default Explore;