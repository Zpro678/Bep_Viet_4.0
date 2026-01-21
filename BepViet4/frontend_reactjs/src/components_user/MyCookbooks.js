// src/components/MyCookbooks.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaEdit, FaBookOpen } from 'react-icons/fa';
import { cookbookService } from '../services/cookbookService'; 
import './CSS/MyCookbooks.css'; 

const MyCookbooks = () => {
  const [cookbooks, setCookbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  const fetchCookbooks = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true); 

      const data = await cookbookService.getAll();
      setCookbooks(data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      
      if (error.response && error.response.status === 401) {
          alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          localStorage.removeItem('ACCESS_TOKEN');
          navigate('/login');
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (!token) {
        alert("Vui lòng đăng nhập để xem bộ sưu tập!");
        navigate('/login');
        return;
    }

    fetchCookbooks(false);
  }, [navigate, fetchCookbooks]);

  // --- XỬ LÝ SỰ KIỆN ---
  const handleCreateNew = async () => {
    const name = prompt("Nhập tên bộ sưu tập mới:");
    if (name) {
      try {
        await cookbookService.create(name); 
        await fetchCookbooks(true); 
        alert("Đã tạo thành công!");
      } catch (error) {
        if (error.response && error.response.status === 401) {
             navigate('/login');
             return;
        }
        alert("Lỗi khi tạo: " + (error.response?.data?.message || "Lỗi server"));
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bộ sưu tập này?")) {
      try {
        await cookbookService.delete(id);
        await fetchCookbooks(true);
      } catch (error) {
        if (error.response && error.response.status === 401) {
            navigate('/login');
            return;
       }
        alert("Không thể xóa bộ sưu tập này.");
      }
    }
  };

  const handleRename = async (id, currentName) => {
    const newName = prompt("Nhập tên mới cho bộ sưu tập:", currentName);

    if (newName && newName.trim() !== "" && newName !== currentName) {
      try {
        await cookbookService.update(id, newName);
        await fetchCookbooks(true);
      } catch (error) {
        if (error.response && error.response.status === 401) {
            navigate('/login');
            return;
        }
        alert("Lỗi khi đổi tên: " + (error.response?.data?.message || "Vui lòng thử lại"));
      }
    }
  };

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
                {/* CẬP NHẬT PHẦN NÀY:
                   1. Kiểm tra book.hinh_anh_bia từ backend.
                   2. Nếu không có thì dùng placeholder.
                   3. Thêm onError để xử lý trường hợp link ảnh bị hỏng (404).
                */}
                <img 
                  src={book.hinh_anh_bia ? book.hinh_anh_bia : 'https://via.placeholder.com/300?text=No+Image'} 
                  alt={book.ten_bo_suu_tap} 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://via.placeholder.com/300?text=Cookbook';
                  }}
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