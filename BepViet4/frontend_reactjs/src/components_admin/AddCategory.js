import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import categoryApi from '../api/categoryApi';

const AddCategory = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ ten_danh_muc: '', mo_ta: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await categoryApi.create(formData);
            alert('Thêm danh mục thành công!');
            navigate('/admin/categories/category');
        } catch (error) {
            alert('Lỗi thêm danh mục');
        }
    };

    return (
        <div className="user-manager-container">
            <h2 className="page-title">Thêm Danh Mục Mới</h2>
            <form onSubmit={handleSubmit} style={{maxWidth: '500px', background: '#fff', padding: '20px', borderRadius: '8px'}}>
                <div style={{marginBottom: '15px'}}>
                    <label>Tên Danh Mục:</label>
                    <input 
                        type="text" className="search-input" style={{width: '100%'}}
                        value={formData.ten_danh_muc} 
                        onChange={(e) => setFormData({...formData, ten_danh_muc: e.target.value})} required
                    />
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label>Mô tả:</label>
                    <textarea 
                        className="search-input" style={{width: '100%', height: '80px'}}
                        value={formData.mo_ta} 
                        onChange={(e) => setFormData({...formData, mo_ta: e.target.value})}
                    ></textarea>
                </div>
                 <div className='d-flex justify-content-end align-items-center gap-3'>
                    <button type="button" className="btn-icon" style={{marginLeft: '10px', width: 'auto', padding: '0 15px'}} onClick={() => navigate('/admin/categories/category')}>Hủy</button>
                    <button type="submit" className="btn-add-new">Lưu lại</button>
                </div>
            </form>
        </div>
    );
};

export default AddCategory;