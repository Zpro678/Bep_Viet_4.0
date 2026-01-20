import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// 👇 Bỏ FaLock, FaUnlock. Chỉ giữ lại Edit, Trash, Search, Plus
import { FaEdit, FaTrash, FaSearch, FaPlus, FaLock, FaUnlock } from 'react-icons/fa';
import AdminApi from '../api/AdminApi'; 
import './CSS/UserManagement.css'; 

const UserManagement = () => {
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Hàm lấy danh sách User
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await AdminApi.getUsers(); 
      
      let userList = [];
      if (response?.data?.data?.data && Array.isArray(response.data.data.data)) {
          userList = response.data.data.data;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
          userList = response.data.data;
      } else if (Array.isArray(response?.data)) {
          userList = response.data;
      } else if (Array.isArray(response)) {
          userList = response;
      }
      setUsers(userList);

    } catch (error) {
      console.error("Lỗi khi tải danh sách user:", error);
      setUsers([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Xử lý Xóa (Gọi API xóa luôn)
  const handleDelete = async (id) => {
      if(window.confirm('Hành động này không thể hoàn tác. Bạn chắc chắn muốn XÓA VĨNH VIỄN người dùng này?')) {
          try {
              await AdminApi.deleteUser(id); // Gọi API xóa
              setUsers(users.filter(u => u.ma_nguoi_dung !== id)); // Cập nhật giao diện
              alert("Đã xóa người dùng thành công.");
          } catch (error) {
              console.error("Lỗi khi xóa:", error);
              alert("Xóa thất bại. Có thể người dùng này đang có dữ liệu ràng buộc.");
          }
      }
  }

  const handleEdit = (id) => {
      alert(`Đang phát triển: Sửa user ID ${id}`);
      // navigate(`/admin/users/edit/${id}`);
  }

  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    const name = user.ho_ten ? user.ho_ten.toLowerCase() : '';
    const email = user.email ? user.email.toLowerCase() : '';
    const search = searchTerm.toLowerCase();
    return name.includes(search) || email.includes(search);
  }) : [];

  return (
    <div className="user-manager-container">
      {/* HEADER */}
      <div className="page-header">
        <h2 className="page-title">Quản Lý Người Dùng</h2>
        
        <div className="header-actions">
           <div className="search-box">
                <FaSearch className="search-icon" />
                <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Tìm tên, email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <Link to="/admin/create-user" className="btn-add-new">
                <FaPlus style={{marginRight: '5px'}} /> Thêm mới
            </Link>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
          <div className="loading-text">Đang tải dữ liệu...</div>
      ) : (
        <table className="user-table">
            <thead>
                <tr>
                    <th style={{width: '50px'}}>ID</th>
                    <th>Thành viên</th>
                    <th>Vai trò</th>
                    {/* Bỏ cột Trạng thái nếu muốn, hoặc giữ lại để xem thôi */}
                    <th>Trạng thái</th> 
                    <th style={{textAlign: 'right'}}>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                        const status = user.trang_thai || 'active'; 

                        return (
                        <tr key={user.ma_nguoi_dung}>
                            <td>#{user.ma_nguoi_dung}</td>
                            <td>
                                <div className="user-cell">
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${user.ho_ten}&background=random&color=fff`} 
                                        alt="avatar" 
                                        className="user-avatar-img"
                                    />
                                    <div className="user-info-text">
                                        <span className="user-name">{user.ho_ten}</span>
                                        <span className="user-email">{user.email}</span>
                                    </div>
                                </div>
                            </td>
                            
                            <td>
                                <span style={{ 
                                    fontWeight: 'bold', 
                                    color: user.vai_tro === 'admin' ? '#d32f2f' : 
                                           user.vai_tro === 'blogger' ? '#1976d2' : '#388e3c'
                                }}>
                                    {user.vai_tro ? user.vai_tro.toUpperCase() : 'USER'}
                                </span>
                            </td>

                            <td>
                                <span className={`status-badge ${status === 'active' ? 'status-active' : 'status-banned'}`}>
                                    {status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                                </span>
                            </td>

                            <td>
                                <div className="action-buttons" style={{justifyContent: 'flex-end'}}>
                                    
                                    {/* Nút Sửa: Màu xanh */}
                                    <button 
                                        className="btn-icon btn-edit"
                                        onClick={() => handleEdit(user.ma_nguoi_dung)}
                                        title="Chỉnh sửa"
                                    >
                                        <FaEdit />
                                    </button>

                                    {/* Nút Xóa: Màu đỏ (Gọi API xóa) */}
                                    <button 
                                        className="btn-icon btn-deleted"
                                        onClick={() => handleDelete(user.ma_nguoi_dung)}
                                        title="Xóa vĩnh viễn"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )})
                ) : (
                   <tr>
                       <td colSpan="5" style={{textAlign: "center", padding: "20px"}}>
                           Không tìm thấy người dùng nào.
                       </td>
                   </tr>
                )}
            </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;