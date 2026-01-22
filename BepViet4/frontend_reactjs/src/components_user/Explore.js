import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import feedApi from '../api/explore_feedApi';
import searchBarApi from '../api/searchBarApi'; // Đã sửa đường dẫn import đúng
import './CSS/Explore.css';

const Explore = () => {
  // 1. State dữ liệu
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hook lấy params từ URL
  const [searchParams] = useSearchParams();

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Lấy thông tin user (để gợi ý món ăn phù hợp nếu cần)
  const user = JSON.parse(localStorage.getItem('USER'));
  const userId = user?.ma_nguoi_dung;

  // 2. Gọi API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        let response;

        // Kiểm tra: Đang tìm kiếm hay đang xem Explore mặc định?
        const currentParams = Object.fromEntries([...searchParams]);
        const isSearching = Object.keys(currentParams).length > 0;

        if (isSearching) {
            console.log("🔍 Đang tìm kiếm với params:", currentParams);
            // Gọi API Search với limit lớn để FE tự phân trang
            response = await searchBarApi.search({ ...currentParams, limit: 100 }); 
        } else {
            console.log("🌍 Đang tải News Feed mặc định");
            // Gọi API Explore Feed
            response = await feedApi.getExploreRecipes(userId); 
        }

        // --- Chuẩn hóa dữ liệu trả về (Xử lý trường hợp data lồng nhau) ---
        let rawList = [];
        if (response?.data?.data && Array.isArray(response.data.data)) {
            rawList = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
            rawList = response.data;
        } else if (Array.isArray(response)) {
            rawList = response;
        }

        // --- MAP DỮ LIỆU (Đoạn quan trọng đã sửa lỗi hình ảnh) ---
        const mappedRecipes = rawList.map(item => {
          // Xử lý an toàn cho hình ảnh
          let imageUrl = 'https://placehold.co/600x400?text=No+Image';
          
          if (item.hinh_anh) {
             // Kiểm tra kỹ: phải là chuỗi mới dùng startsWith
             if (typeof item.hinh_anh === 'string' && item.hinh_anh.startsWith('http')) {
                 imageUrl = item.hinh_anh;
             } else {
                 // Nếu là chuỗi tên file hoặc object, nối domain vào
                 imageUrl = `http://localhost:8000/storage/${item.hinh_anh}`;
             }
          }

          return {
            id: item.ma_cong_thuc,
            title: item.ten_mon,
            // Ưu tiên lấy tên từ object quan hệ nguoi_tao, nếu không có thì lấy ten_nguoi_tao
            author: item.nguoi_tao?.ho_ten || item.ten_nguoi_tao || "Ẩn danh",
            image: imageUrl,
            originalData: item
          };
        });

        setRecipes(mappedRecipes);
        setCurrentPage(1); // Reset về trang 1 khi dữ liệu thay đổi

      } catch (err) {
        console.error('❌ Lỗi tải dữ liệu:', err);
        setError('Không thể tải danh sách món ăn. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
    
  }, [userId, searchParams]); // Chạy lại khi userId hoặc URL params thay đổi

  const handleSave = (e, recipeId) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Đã lưu công thức #${recipeId}`);
  };

  // 3. Logic Phân trang Frontend
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecipes = recipes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(recipes.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => { if (currentPage < totalPages) paginate(currentPage + 1); };
  const goToPrevPage = () => { if (currentPage > 1) paginate(currentPage - 1); };

  // Render các nút phân trang (có dấu ...)
  const renderPaginationButtons = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pageNumbers.map((number, index) => {
      if (number === '...') return <span key={`dots-${index}`} className="pagination-dots">...</span>;
      return (
        <button key={number} onClick={() => paginate(number)} className={`page-btn ${currentPage === number ? 'active' : ''}`}>
          {number}
        </button>
      );
    });
  };

  // 4. Render Giao diện
  if (loading) {
    return (
        <div className="explore-container" style={{ textAlign: 'center', marginTop: 50 }}>
            <h3>⏳ Đang tải món ngon...</h3>
        </div>
    );
  }

  if (error) {
    return (
        <div className="explore-container" style={{ textAlign: 'center', color: 'red', marginTop: 50 }}>
            <h3>⚠️ {error}</h3>
        </div>
    );
  }

  return (
    <div className="explore-container">
      {/* Tiêu đề thay đổi dựa theo trạng thái tìm kiếm */}
      <h2 className="page-title">
        {[...searchParams].length > 0 ? `Kết quả tìm kiếm 🔍` : `Khám phá món ngon 🍳`}
      </h2>

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
                      e.target.onerror = null; 
                      e.target.src = 'https://placehold.co/600x400?text=No+Image'; 
                  }}
                />
                <button className="save-btn" onClick={(e) => handleSave(e, recipe.id)}>🔖</button>
              </div>

              <div className="explore-info">
                <h3 className="explore-title">{recipe.title}</h3>
                <span className="explore-author">bởi {recipe.author}</span>
              </div>
            </Link>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>
             <h3>📭 Không tìm thấy công thức nào!</h3>
             <p>Hãy thử thay đổi từ khóa hoặc bộ lọc tìm kiếm.</p>
          </div>
        )}
      </div>

      {/* Thanh phân trang */}
      {recipes.length > itemsPerPage && (
        <div className="pagination">
          <button onClick={goToPrevPage} disabled={currentPage === 1} className="page-btn arrow-btn">&laquo;</button>
          {renderPaginationButtons()}
          <button onClick={goToNextPage} disabled={currentPage === totalPages} className="page-btn arrow-btn">&raquo;</button>
        </div>
      )}
    </div>
  );
};

export default Explore;