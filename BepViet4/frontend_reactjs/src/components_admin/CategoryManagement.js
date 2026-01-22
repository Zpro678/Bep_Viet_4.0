import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaList } from 'react-icons/fa';
import categoryApi from '../api/categoryApi'; 
import './CSS/UserManagement.css'; 

const CategoryManagement = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Lấy dữ liệu
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getAll(); 
      // API của bạn trả về { data: [...] } nên cần lấy response.data
      setCategories(response.data || []);
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. Hàm Xóa
  const handleDelete = async (id) => {
      if(window.confirm('Bạn có chắc muốn xóa danh mục này không?')) {
          try {
              await categoryApi.delete(id);
              // Cập nhật giao diện: Loại bỏ item vừa xóa khỏi mảng
              setCategories(categories.filter(c => c.ma_danh_muc !== id));
              alert("Xóa thành công.");
          } catch (error) { 
              console.error(error);
              alert("Lỗi khi xóa: " + (error.response?.data?.message || "Lỗi hệ thống")); 
          }
      }
  }

  // 3. Lọc tìm kiếm
  const filteredData = categories.filter(c => 
    (c.ten_danh_muc || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-manager-container">
      <div className="page-header">
        <h2 className="page-title">Quản Lý Danh Mục</h2>
        <div className="header-actions">
           <div className="search-box">
                <FaSearch className="search-icon" />
                <input 
                    type="text" className="search-input" placeholder="Tìm danh mục..." 
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
           </div>
           
           {/* Nút thêm mới: Chú ý đường dẫn phải khớp với Route trong App.js */}
           <button className="btn-add-new" onClick={() => navigate('/admin/categories/category/add')}>
               <FaPlus /> Thêm mới
           </button>
        </div>
      </div>

      {loading ? <div className="loading-text">Đang tải dữ liệu...</div> : (
        <table className="user-table">
            <thead>
                <tr>
                    <th style={{width: '50px'}}>ID</th>
                    <th>Tên Danh Mục</th>
                    <th>Mô tả</th>
                    <th style={{textAlign: 'right'}}>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.length > 0 ? (
                    filteredData.map((cat) => (
                        <tr key={cat.ma_danh_muc}>
                            <td>#{cat.ma_danh_muc}</td>
                            <td>
                                <div className="user-cell">
                                    <div className="user-avatar-img" style={{background:'#f3e5f5', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                        <FaList color="#9c27b0"/>
                                    </div>
                                    <span className="user-name">{cat.ten_danh_muc}</span>
                                </div>
                            </td>
                            <td style={{color: '#666'}}>{cat.mo_ta}</td>
                            <td>
                                <div className="action-buttons" style={{justifyContent: 'flex-end'}}>
                                    {/* 👇 Đã thêm onClick cho nút Sửa */}
                                    <button 
                                        className="btn-icon btn-edit"
                                        onClick={() => navigate(`/admin/categories/category/edit/${cat.ma_danh_muc}`)}
                                    >
                                        <FaEdit />
                                    </button>

                                    {/* Nút Xóa */}
                                    <button 
                                        className="btn-icon btn-deleted" 
                                        onClick={() => handleDelete(cat.ma_danh_muc)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>
                            Không tìm thấy danh mục nào.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryManagement;