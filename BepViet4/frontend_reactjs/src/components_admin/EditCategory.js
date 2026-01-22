import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import categoryApi from '../api/categoryApi';
import { FaSave } from 'react-icons/fa';

const EditCategory = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy ID từ URL
    
    const [formData, setFormData] = useState({
        ten_danh_muc: '', 
        mo_ta: ''
    });

    // 1. Hàm lấy dữ liệu cũ
    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                // Gọi API lấy chi tiết
                const response = await categoryApi.getById(id);
                
                console.log("API Response:", response);

                // 👇 LOGIC FIX LỖI (Giống bên Vùng Miền):
                // Nếu response có .data thì lấy, không thì lấy chính nó
                const data = response && response.data ? response.data : response;

                if (data) {
                    setFormData({
                        ten_danh_muc: data.ten_danh_muc || '',
                        mo_ta: data.mo_ta || ''
                    });
                } else {
                    console.error("Dữ liệu trả về rỗng");
                }
            } catch (error) {
                console.error("Lỗi lấy dữ liệu:", error);
                alert("Không tìm thấy danh mục này!");
                navigate('/admin/categories/category');
            }
        };

        if (id) {
            fetchCategoryData();
        }
    }, [id, navigate]);

    // 2. Xử lý khi nhập liệu
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 3. Xử lý lưu (Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await categoryApi.update(id, formData);
            alert('Cập nhật danh mục thành công!');
            navigate('/admin/categories/category');
        } catch (error) {
            console.error(error);
            // Lấy thông báo lỗi từ Laravel trả về (nếu có)
            const mess = error.response?.data?.message || 'Không thể cập nhật';
            const errorDetails = error.response?.data?.errors 
                                ? '\n' + JSON.stringify(error.response.data.errors) 
                                : '';
            alert('Lỗi: ' + mess + errorDetails);
        }
    };

    return (
        <div className="user-manager-container">
            <h2 className="page-title">Chỉnh Sửa Danh Mục</h2>
            <form onSubmit={handleSubmit} style={{maxWidth: '500px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'}}>
                
                {/* Tên danh mục */}
                <div style={{marginBottom: '15px'}}>
                    <label style={{fontWeight: 'bold'}}>Tên Danh Mục <span style={{color:'red'}}>*</span>:</label>
                    <input 
                        type="text" 
                        name="ten_danh_muc" 
                        className="search-input" 
                        style={{width: '100%', marginTop: '5px'}}
                        value={formData.ten_danh_muc} 
                        onChange={handleChange} 
                        required
                        placeholder="Ví dụ: Món ăn sáng, Đồ uống..."
                    />
                </div>

                {/* Mô tả */}
                <div style={{marginBottom: '15px'}}>
                    <label style={{fontWeight: 'bold'}}>Mô tả:</label>
                    <textarea 
                        name="mo_ta" 
                        className="search-input" 
                        style={{width: '100%', marginTop: '5px', height: '100px'}}
                        value={formData.mo_ta} 
                        onChange={handleChange}
                        placeholder="Mô tả ngắn về danh mục này..."
                    ></textarea>
                </div>

                {/* Buttons */}
                <div className='d-flex justify-content-end align-items-center gap-2'>
                    <button type="button" className="btn-icon" style={{width: 'auto', padding: '8px 20px', border:'1px solid #ccc', background:'#f8f9fa'}} 
                            onClick={() => navigate('/admin/categories/category')}>
                        Hủy
                    </button>
                    <button type="submit" className="btn-add-new" style={{display:'flex', alignItems:'center', gap:'5px'}}>
                        <FaSave /> Cập nhật
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCategory;