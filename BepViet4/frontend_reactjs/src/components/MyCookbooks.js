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
    fetchCookbooks();
  }, []);

  const fetchCookbooks = async () => {
    try {
      setLoading(true);
      const data = await cookbookService.getAll();
      setCookbooks(data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. XỬ LÝ SỰ KIỆN ---
  const handleCreateNew = async () => {
    const name = prompt("Nhập tên bộ sưu tập mới:");
    if (name) {
      const newItem = await cookbookService.create({ 
        title: name, 
        description: 'Mô tả ngắn về bộ sưu tập này...' 
      });
      setCookbooks([newItem, ...cookbooks]);
      alert("Đã tạo thành công!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bộ sưu tập này?")) {
      await cookbookService.delete(id);
      setCookbooks(cookbooks.filter(item => item.id !== id));
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
            <div key={book.id} className="collection-card">
              {/* Hình ảnh */}
              <div className="card-image-wrapper">
                {/* SỬA 1: Dữ liệu service trả về là 'image', không phải 'thumbnail' */}
                <img 
                  src={book.image || 'https://via.placeholder.com/300'} 
                  alt={book.title} 
                />
                <div className="card-overlay">
                  {/* SỬA 2: Sửa đường dẫn từ 'collection' thành 'cookbook' để khớp với Router */}
                  <Link to={`/cookbook/${book.id}`} className="btn-view">
                    Xem chi tiết
                  </Link>
                </div>
              </div>

              {/* Nội dung */}
              <div className="card-body">
                <div className="card-meta">
                  <span className="recipe-count">{book.recipes_count || 0} công thức</span>
                  <span className="date-create">{book.created_at}</span>
                </div>
                <h3 className="card-title">{book.title}</h3>
                <p className="card-desc">{book.description}</p>
                
                {/* Actions */}
                <div className="card-actions">
                  <button className="action-btn edit" title="Chỉnh sửa">
                    <FaEdit />
                  </button>
                  <button 
                    className="action-btn delete" 
                    title="Xóa"
                    onClick={() => handleDelete(book.id)}
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