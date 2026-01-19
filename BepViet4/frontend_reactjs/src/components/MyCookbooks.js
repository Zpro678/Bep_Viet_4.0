// src/components/MyCookbooks.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaEdit, FaBookOpen } from 'react-icons/fa';
import { cookbookService } from '../services/cookbookService'; 
import './CSS/MyCookbooks.css'; 

const MyCookbooks = () => {
  const [cookbooks, setCookbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. LOAD DATA ---
  useEffect(() => {
    // Lần đầu vào trang thì load bình thường (hiện loading)
    fetchCookbooks(false);
  }, []);

  // SỬA: Thêm tham số isBackground (mặc định là false)
  const fetchCookbooks = async (isBackground = false) => {
    try {
      // Chỉ hiện spinner khi KHÔNG PHẢI là chạy ngầm
      if (!isBackground) {
        setLoading(true); 
      }

      const data = await cookbookService.getAll();
      setCookbooks(data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      // Chỉ tắt spinner nếu trước đó đã bật
      if (!isBackground) {
        setLoading(false);
      }
    }
  };

  // --- 2. XỬ LÝ SỰ KIỆN ---
  
  // 2.1 Tạo mới
  const handleCreateNew = async () => {
    const name = prompt("Nhập tên bộ sưu tập mới:");
    if (name) {
      try {
        await cookbookService.create(name); 
        // Tạo xong reload lại danh sách (có thể để true nếu muốn silent, hoặc false để nháy 1 cái báo hiệu)
        await fetchCookbooks(true); 
        alert("Đã tạo thành công!");
      } catch (error) {
        alert("Lỗi khi tạo: " + (error.response?.data?.message || "Lỗi server"));
      }
    }
  };

  // 2.2 Xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bộ sưu tập này?")) {
      try {
        await cookbookService.delete(id);
        // Xóa xong reload ngầm
        await fetchCookbooks(true);
      } catch (error) {
        alert("Không thể xóa bộ sưu tập này.");
      }
    }
  };

  // 2.3 Đổi tên (ĐÃ TỐI ƯU UX)
  const handleRename = async (id, currentName) => {
    const newName = prompt("Nhập tên mới cho bộ sưu tập:", currentName);

    // Kiểm tra hợp lệ
    if (newName && newName.trim() !== "" && newName !== currentName) {
      try {
        // 1. Gọi API cập nhật
        await cookbookService.update(id, newName);

        // 2. QUAN TRỌNG: Gọi fetch với tham số TRUE (Chạy ngầm)
        // Giao diện sẽ tự đổi tên ngay lập tức mà không hiện Loading
        await fetchCookbooks(true);

      } catch (error) {
        console.error(error);
        alert("Lỗi khi đổi tên: " + (error.response?.data?.message || "Vui lòng thử lại"));
      }
    }
  };

  // --- 3. RENDER GIAO DIỆN ---
  if (loading) {
    return <div className="loading-spinner">Đang tải bộ sưu tập...</div>;
  }

  return (
    <div className="collection-container">
      <div className="collection-header">
        <div>
          <h2>Bộ sưu tập của tôi</h2>
          <p className="subtitle">Lưu giữ những công thức yêu thích của bạn</p>
        </div>
        <button className="btn-create" onClick={handleCreateNew}>
          <FaPlus /> Tạo mới
        </button>
      </div>

      {cookbooks.length === 0 ? (
        <div className="empty-state">
          <FaBookOpen className="empty-icon" />
          <p>Bạn chưa có bộ sưu tập nào.</p>
          <button className="btn-link" onClick={handleCreateNew}>Tạo ngay</button>
        </div>
      ) : (
        <div className="collection-grid">
          {cookbooks.map((book) => (
            <div key={book.ma_bo_suu_tap} className="collection-card">
              
              <div className="card-image-wrapper">
                {/* Ảnh placeholder hoặc ảnh thật nếu có */}
                <img 
                  src={'https://via.placeholder.com/300?text=Cookbook'} 
                  alt={book.ten_bo_suu_tap} 
                />
                <div className="card-overlay">
                  <Link to={`/cookbook/${book.ma_bo_suu_tap}`} className="btn-view">
                    Xem chi tiết
                  </Link>
                </div>
              </div>

              <div className="card-body">
                <div className="card-meta">
                  <span className="recipe-count">
                    {book.cong_thucs_count || 0} công thức
                  </span>
                  <span className="date-create">
                    {new Date(book.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                
                <h3 className="card-title">{book.ten_bo_suu_tap}</h3>
                <p className="card-desc">Danh sách các món ăn yêu thích</p>
                
                <div className="card-actions">
                  <button 
                    className="action-btn edit" 
                    title="Chỉnh sửa tên"
                    onClick={() => handleRename(book.ma_bo_suu_tap, book.ten_bo_suu_tap)}
                  >
                    <FaEdit />
                  </button>
                  
                  <button 
                    className="action-btn delete" 
                    title="Xóa"
                    onClick={() => handleDelete(book.ma_bo_suu_tap)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCookbooks;