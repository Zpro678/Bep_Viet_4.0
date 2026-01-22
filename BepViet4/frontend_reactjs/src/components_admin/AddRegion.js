import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import regionApi from '../api/regionApi';
import { FaSave } from 'react-icons/fa'; // Import icon cho đẹp (nếu muốn)

const AddRegion = () => {
    const navigate = useNavigate();
    
    // 👇 Sửa tên key state cho khớp với DB
    const [formData, setFormData] = useState({
        ten_vung_mien: '', 
        mo_ta: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await regionApi.create(formData);
            alert('Thêm vùng miền thành công!');
            navigate('/admin/categories/regions');
        } catch (error) {
            console.error(error);
            // Hiển thị lỗi chi tiết từ Backend trả về
            alert('Lỗi: ' + (error.response?.data?.message || 'Không thể thêm vùng miền'));
        }
    };

    return (
        <div className="user-manager-container">
            <h2 className="page-title">Thêm Vùng Miền Mới</h2>
            <form onSubmit={handleSubmit} style={{maxWidth: '500px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'}}>
                
                {/* Tên vùng miền */}
                <div style={{marginBottom: '15px'}}>
                    <label style={{fontWeight: 'bold'}}>Tên Vùng <span style={{color:'red'}}>*</span>:</label>
                    <input 
                        type="text" 
                        name="ten_vung_mien" // 👇 Sửa name attribute khớp với state và DB
                        className="search-input" 
                        style={{width: '100%', marginTop: '5px'}}
                        value={formData.ten_vung_mien} // 👇 Sửa value
                        onChange={handleChange} 
                        required
                        placeholder="Ví dụ: Miền Tây, Tây Bắc..."
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
                        placeholder="Mô tả ngắn về vùng miền này..."
                    ></textarea>
                </div>

                {/* Buttons */}
                <div className='d-flex justify-content-end align-items-center gap-2'>
                    <button type="button" className="btn-icon" style={{width: 'auto', padding: '8px 20px', border:'1px solid #ccc', background:'#f8f9fa'}} 
                            onClick={() => navigate('/admin/categories/regions')}>
                        Hủy
                    </button>
                    <button type="submit" className="btn-add-new" style={{display:'flex', alignItems:'center', gap:'5px'}}>
                        <FaSave /> Lưu lại
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRegion;