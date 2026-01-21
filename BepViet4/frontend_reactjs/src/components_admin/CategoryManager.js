import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryManager = ({ title, apiEndpoint }) => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);

    // Quản lý Modal và Form
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [isEdit, setIsEdit] = useState(false);

    // Lấy dữ liệu linh hoạt (Hỗ trợ cấu hình của NguyenLieuController)
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(apiEndpoint);
            // Ưu tiên response.data.data (theo chuẩn Laravel của bạn), nếu không có thì lấy response.data
            let realData = response.data?.data || response.data;

            // Xử lý trường hợp phân trang (Bài viết)
            if (realData?.data && Array.isArray(realData.data)) {
                realData = realData.data;
            }

            if (Array.isArray(realData) && realData.length > 0) {
                setData(realData);
                // Lấy các key từ bản ghi đầu tiên làm tên cột, bỏ các cột hệ thống
                const keys = Object.keys(realData[0]).filter(k =>
                    !['created_at', 'updated_at', 'email_verified_at', 'password'].includes(k)
                );
                setColumns(keys);
            } else {
                setData([]);
            }
        } catch (err) {
            console.error("Lỗi tải danh mục:", err);
        } finally { setLoading(false); }
    };

    useEffect(() => { if (apiEndpoint) fetchData(); }, [apiEndpoint]);

    // Xử lý Xóa (Dùng cho mọi danh mục)
    const handleDelete = async (item) => {
        const id = Object.values(item)[0]; // Luôn lấy giá trị cột đầu tiên làm ID
        if (window.confirm(`Bạn có chắc muốn xóa mục này trong ${title}?`)) {
            try {
                await axios.delete(`${apiEndpoint}/${id}`);
                alert("Xóa thành công!");
                fetchData();
            } catch (err) { alert("Lỗi khi xóa! Có thể do ràng buộc dữ liệu."); }
        }
    };

    // Xử lý Lưu (Thêm/Sửa)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const id = Object.values(formData)[0];
        try {
            if (isEdit) {
                await axios.put(`${apiEndpoint}/${id}`, formData);
                alert("Cập nhật thành công!");
            } else {
                await axios.post(apiEndpoint, formData);
                alert("Thêm mới thành công!");
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi xử lý dữ liệu!");
        }
    };

    return (
        <div style={{ padding: '20px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ textTransform: 'capitalize' }}>Quản lý {title}</h2>
                <button
                    onClick={() => { setIsEdit(false); setFormData({}); setShowModal(true); }}
                    style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    + Thêm {title}
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f4f7f6' }}>
                            {columns.map((col, i) => (
                                <th key={i} style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', textTransform: 'capitalize' }}>
                                    {col.replace(/_/g, ' ')}
                                </th>
                            ))}
                            <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, rowIdx) => (
                            <tr key={rowIdx} style={{ borderBottom: '1px solid #eee' }}>
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} style={{ padding: '12px' }}>
                                        {col.includes('hinh_anh') ? (
                                            <img src={item[col]} alt="thumb" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                        ) : String(item[col] || '---')}
                                    </td>
                                ))}
                                <td style={{ textAlign: 'center', padding: '12px' }}>
                                    <button
                                        onClick={() => { setIsEdit(true); setFormData(item); setShowModal(true); }}
                                        style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item)}
                                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL FORM TỰ ĐỘNG - CHÌA KHÓA DÙNG CHUNG ALL DANH MỤC */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
                    <div style={{ background: 'white', padding: '25px', borderRadius: '8px', width: '450px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3>{isEdit ? "Cập nhật" : "Thêm mới"} {title}</h3>
                        <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
                            {columns.map((col, i) => (
                                <div key={i} style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', textTransform: 'capitalize' }}>
                                        {col.replace(/_/g, ' ')}:
                                    </label>
                                    <input
                                        type="text"
                                        value={formData[col] || ''}
                                        onChange={(e) => setFormData({ ...formData, [col]: e.target.value })}
                                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                                        disabled={isEdit && i === 0} // Khóa cột ID khi đang sửa
                                        placeholder={`Nhập ${col.replace(/_/g, ' ')}...`}
                                        required={i !== 0 && !col.includes('hinh_anh')}
                                    />
                                </div>
                            ))}
                            <div style={{ textAlign: 'right', marginTop: '20px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 16px', marginRight: '10px' }}>Hủy</button>
                                <button type="submit" style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}>
                                    Lưu dữ liệu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManager;