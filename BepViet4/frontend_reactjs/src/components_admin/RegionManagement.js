import React, { useState, useEffect } from 'react';
// 👇 1. Import useNavigate
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaGlobeAsia } from 'react-icons/fa';
import regionApi from '../api/regionApi'; 
import './CSS/UserManagement.css'; 

const RegionManagement = () => {
  // 👇 2. Khai báo hook
  const navigate = useNavigate();
  
  const [regions, setRegions] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRegions = async () => {
    try {
      setLoading(true);
      const response = await regionApi.getAll(); 
      setRegions(response.data || []); 
    } catch (error) {
      console.error("Lỗi tải vùng miền:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const handleDelete = async (id) => {
      if(window.confirm('Bạn có chắc chắn muốn xóa vùng miền này?')) {
          try {
              await regionApi.delete(id);
              setRegions(regions.filter(r => (r.id !== id && r.ma_vung_mien !== id)));
              alert("Đã xóa thành công.");
          } catch (error) {
              alert("Xóa thất bại!");
          }
      }
  }

  const filteredRegions = regions.filter(r => 
    (r.ten_vung || r.ten_vung_mien || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-manager-container">
      <div className="page-header">
        <h2 className="page-title">Quản Lý Vùng Miền</h2>
        <div className="header-actions">
           <div className="search-box">
                <FaSearch className="search-icon" />
                <input 
                    type="text" className="search-input" placeholder="Tìm tên vùng..." 
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
           </div>
           {/* 👇 3. Sửa sự kiện onClick để chuyển trang */}
           <button className="btn-add-new" onClick={() => navigate('/admin/categories/regions/add')}>
                <FaPlus style={{marginRight: '5px'}} /> Thêm mới
           </button>
        </div>
      </div>
      
      {/* ... (Phần Table giữ nguyên như cũ) ... */}
      {loading ? <div className="loading-text">Đang tải...</div> : (
        <table className="user-table">
            <thead>
                <tr>
                    <th style={{width: '50px'}}>ID</th>
                    <th>Tên Vùng Miền</th>
                    <th>Mô tả</th>
                    <th style={{textAlign: 'right'}}>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {filteredRegions.length > 0 ? filteredRegions.map((region) => (
                    <tr key={region.id || region.ma_vung_mien}>
                        <td>#{region.id || region.ma_vung_mien}</td>
                        <td>
                            <div className="user-cell">
                                <div className="user-avatar-img" style={{background:'#e3f2fd', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                    <FaGlobeAsia color="#1976d2"/>
                                </div>
                                <span className="user-name">{region.ten_vung || region.ten_vung_mien}</span>
                            </div>
                        </td>
                        <td>{region.mo_ta || 'Không có mô tả'}</td>
                        <td>
                            <div className="action-buttons" style={{justifyContent: 'flex-end'}}>
    
                                {/* 👇 BẠN ĐANG THIẾU SỰ KIỆN onClick Ở DÒNG DƯỚI NÀY */}
                                <button 
                                    className="btn-icon btn-edit"
                                    onClick={() => navigate(`/admin/categories/regions/edit/${region.id || region.ma_vung_mien}`)}
                                >
                                    <FaEdit />
                                </button>

                                <button className="btn-icon btn-deleted" onClick={() => handleDelete(region.id || region.ma_vung_mien)}>
                                    <FaTrash />
                                </button>
                            </div>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="4" style={{textAlign: "center"}}>Không tìm thấy dữ liệu.</td></tr>
                )}
            </tbody>
        </table>
      )}
    </div>
  );
};

export default RegionManagement;