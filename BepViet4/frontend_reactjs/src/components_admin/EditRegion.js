import React, { useState, useEffect } from 'react';
// 👇 1. Import thêm useParams để lấy ID từ URL
import { useNavigate, useParams } from 'react-router-dom';
import regionApi from '../api/regionApi';
import { FaSave } from 'react-icons/fa';

const EditRegion = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy ID từ đường dẫn
    
    const [formData, setFormData] = useState({
        ten_vung_mien: '', 
        mo_ta: ''
    });

    // 👇 2. Hàm lấy dữ liệu cũ khi mới vào trang
    useEffect(() => {
    const fetchRegionData = async () => {
        try {
            const response = await regionApi.getById(id);
            
            // 👇 LOG RA ĐỂ KIỂM TRA (quan trọng)
            console.log("API Response:", response);

            // 👇 LOGIC FIX LỖI:
            // Nếu response có thuộc tính .data thì lấy .data, nếu không thì lấy chính response
            const data = response && response.data ? response.data : response;

            // Kiểm tra kỹ data có dữ liệu không trước khi Set
            if (data) {
                setFormData({
                    // Dùng toán tử || '' để tránh lỗi nếu null
                    ten_vung_mien: data.ten_vung_mien || '', 
                    mo_ta: data.mo_ta || ''
                });
            } else {
                console.error("Dữ liệu trả về rỗng hoặc không đúng định dạng");
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
            // alert("Không tìm thấy vùng miền này!"); 
            // navigate('/admin/categories/regions'); // Tạm thời comment dòng này để debug
        }
    };

    if (id) {
        fetchRegionData();
    }
}, [id, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 👇 3. Gọi hàm Update thay vì Create
            await regionApi.update(id, formData);
            alert('Cập nhật vùng miền thành công!');
            navigate('/admin/categories/regions');
        } catch (error) {
            console.error(error);
            alert('Lỗi: ' + (error.response?.data?.message || 'Không thể cập nhật'));
        }
    };

    return (
        <div className="user-manager-container">
            <h2 className="page-title">Chỉnh Sửa Vùng Miền</h2>
            <form onSubmit={handleSubmit} style={{maxWidth: '500px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'}}>
                
                {/* Tên vùng miền */}
                <div style={{marginBottom: '15px'}}>
                    <label style={{fontWeight: 'bold'}}>Tên Vùng <span style={{color:'red'}}>*</span>:</label>
                    <input 
                        type="text" 
                        name="ten_vung_mien" 
                        className="search-input" 
                        style={{width: '100%', marginTop: '5px'}}
                        value={formData.ten_vung_mien} 
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
                        <FaSave /> Cập nhật
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditRegion;