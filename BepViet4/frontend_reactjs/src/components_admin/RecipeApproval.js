import React, { useState, useEffect } from 'react';
import AdminApi from '../api/AdminApi'; 
import './CSS/RecipeApproval.css';

const AdminRecipeApproval = () => {
    // State quản lý danh sách và hiển thị
    const [pendingRecipes, setPendingRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false); // Loading khi bấm nút duyệt

    // Load danh sách khi vào trang
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await AdminApi.getCongThucDangChoDuyet();
            setPendingRecipes(res.data?.data || res.data || []); 
        } catch (error) {
            console.error("Lỗi tải danh sách:", error);
        } finally {
            setLoading(false);
        }
    };

    
    const handleViewDetail = async (id) => {
        try {
            const res = await AdminApi.getDetail(id);
            setSelectedRecipe(res.data || res); 
        } catch (error) {
            alert("Không thể tải chi tiết công thức này.");
        }
    };

    // Xử lý Duyệt / Từ chối
    const handleAction = async (id, status) => {
        const actionName = status === 'cong_khai' ? 'DUYỆT' : 'TỪ CHỐI';
        if (!window.confirm(`Bạn chắc chắn muốn ${actionName} bài này?`)) return;

        setProcessing(true);
        try {
            await AdminApi.updateStatus(id, status);
            
            // Thành công -> Xóa khỏi list và đóng modal
            setPendingRecipes(prev => prev.filter(item => (item.id || item.ma_cong_thuc) !== id));
            setSelectedRecipe(null);
            alert(`Đã ${actionName.toLowerCase()} thành công!`);
        } catch (error) {
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setProcessing(false);
        }
    };

    // --- PHẦN RENDER ---
    return (
        <div className="approval-container">
            <h2 className="page-title">Duyệt Công Thức ({pendingRecipes.length})</h2>

            {loading ? <div className="loading">Đang tải...</div> : (
                pendingRecipes.length === 0 ? <p className="empty-msg">Không có bài viết chờ duyệt.</p> :
                
                <table className="approval-table">
                    <thead>
                        <tr>
                            <th>ID</th><th>Món ăn</th><th>Người đăng</th><th>Ngày tạo</th><th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingRecipes.map(item => {
                            const id = item.id || item.ma_cong_thuc;
                            return (
                                <tr key={id}>
                                    <td>#{id}</td>
                                    <td><strong>{item.ten_mon}</strong></td>
                                    <td>{item.nguoi_dung?.ho_ten || 'Ẩn danh'}</td>
                                    <td>{new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                                    <td>
                                        <button className="btn-view" onClick={() => handleViewDetail(id)}>Xem chi tiết</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}

            {/* --- MODAL CHI TIẾT --- */}
            {selectedRecipe && (
                <RecipeDetailModal 
                    recipe={selectedRecipe} 
                    onClose={() => setSelectedRecipe(null)}
                    onAction={handleAction}
                    processing={processing}
                />
            )}
        </div>
    );
};

// Tách Modal ra thành component con nội bộ cho code chính đỡ rối
const RecipeDetailModal = ({ recipe, onClose, onAction, processing }) => {
    const id = recipe.id || recipe.ma_cong_thuc;
    
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>×</button>
                <h3>{recipe.ten_mon}</h3>
                
                <div className="modal-body">
                    <div className="info-grid">
                        <p><strong>Người đăng:</strong> {recipe.nguoi_dung?.ho_ten}</p>
                        <p><strong>Thời gian:</strong> {recipe.thoi_gian_nau} phút | <strong>Độ khó:</strong> {recipe.do_kho}/5</p>
                    </div>
                    <p className="desc"><i>{recipe.mo_ta}</i></p>

                    <div className="detail-section">
                        <h4>Nguyên liệu:</h4>
                        <ul>
                            {recipe.nguyen_lieus?.map((nl, i) => (
                                <li key={i}>{nl.pivot?.so_luong} {nl.pivot?.don_vi} {nl.ten_nguyen_lieu}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="detail-section">
                        <h4>Cách làm:</h4>
                        {recipe.buoc_thuc_hiens?.map((b, i) => (
                            <div key={i} className="step-item">
                                <b>B{b.thu_tu}:</b> {b.noi_dung}
                                {b.hinh_anh && <img src={b.hinh_anh} alt="" className="step-img" />}
                            </div>
                        ))}
                    </div>

                    <div className="modal-actions">
                        <button className="btn-approve" disabled={processing} onClick={() => onAction(id, 'cong_khai')}>
                            ✅ Duyệt
                        </button>
                        <button className="btn-reject" disabled={processing} onClick={() => onAction(id, 'tu_choi')}>
                            ❌ Từ chối
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRecipeApproval;