import React, { useState, useEffect } from 'react';
// 👇 1. Import useNavigate
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaCarrot } from 'react-icons/fa';
import ingredientApi from '../api/ingredientApi'; 
import './CSS/UserManagement.css'; 

const IngredientManagement = () => {
  // 👇 2. Khai báo hook
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const response = await ingredientApi.getAll(); 
      setIngredients(response.data || []);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleDelete = async (id) => {
      if(window.confirm('Xóa nguyên liệu này?')) {
          try {
              await ingredientApi.delete(id);
              setIngredients(ingredients.filter(i => (i.id !== id && i.ma_nguyen_lieu !== id)));
              alert("Xóa thành công.");
          } catch (error) { alert("Lỗi khi xóa!"); }
      }
  }

  const filteredData = ingredients.filter(i => 
    (i.ten_nguyen_lieu || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-manager-container">
      <div className="page-header">
        <h2 className="page-title">Quản Lý Nguyên Liệu</h2>
        <div className="header-actions">
           <div className="search-box">
                <FaSearch className="search-icon" />
                <input 
                    type="text" className="search-input" placeholder="Tìm nguyên liệu..." 
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
           </div>
           {/* 👇 3. Sửa onClick */}
           <button className="btn-add-new" onClick={() => navigate('/admin//categories/ingredients/add')}>
               <FaPlus /> Thêm mới
           </button>
        </div>
      </div>

      {/* ... (Phần Table giữ nguyên) ... */}
      {loading ? <div className="loading-text">Đang tải...</div> : (
        <table className="user-table">
            <thead>
                <tr>
                    <th style={{width: '50px'}}>ID</th>
                    <th>Tên Nguyên Liệu</th>
                    <th>Loại</th>
                    <th>Hình ảnh</th>
                    <th style={{textAlign: 'right'}}>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.map((item) => (
                    <tr key={item.id || item.ma_nguyen_lieu}>
                        <td>#{item.id || item.ma_nguyen_lieu}</td>
                        <td>
                             <div className="user-cell">
                                <span className="user-name" style={{fontWeight:'bold'}}>{item.ten_nguyen_lieu}</span>
                            </div>
                        </td>
                        <td><span className="status-badge status-active" style={{background:'#eee', color:'#333'}}>{item.loai_nguyen_lieu}</span></td>
                        <td>
                            {item.hinh_anh ? (
                                <img src={item.hinh_anh} alt="" style={{width:'40px', height:'40px', borderRadius:'4px', objectFit:'cover'}} />
                            ) : (
                                <FaCarrot size={24} color="#ff9800"/>
                            )}
                        </td>
                        <td>
                            <div className="action-buttons" style={{justifyContent: 'flex-end'}}>
                                <button className="btn-icon btn-edit"><FaEdit /></button>
                                <button className="btn-icon btn-deleted" onClick={() => handleDelete(item.id || item.ma_nguyen_lieu)}><FaTrash /></button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      )}
    </div>
  );
};

export default IngredientManagement;