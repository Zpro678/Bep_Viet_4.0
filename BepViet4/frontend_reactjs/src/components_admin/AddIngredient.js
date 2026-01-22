import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ingredientApi from '../api/ingredientApi';
import { FaArrowLeft, FaSave, FaImage } from 'react-icons/fa';

const AddIngredient = () => {
    const navigate = useNavigate();

    // 1. State cho các trường văn bản thông thường
    const [formData, setFormData] = useState({
        ten_nguyen_lieu: '',
        loai_nguyen_lieu: 'Rau củ',
    });

    // 2. State riêng để lưu trữ FILE hình ảnh người dùng chọn
    const [selectedImageFile, setSelectedImageFile] = useState(null);

    // 3. State để lưu URL tạm thời phục vụ việc xem trước ảnh (preview)
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    // Xử lý khi thay đổi text inputs
    const handleTextChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Xử lý khi CHỌN FILE ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Lấy file đầu tiên người dùng chọn
        if (file) {
            setSelectedImageFile(file); // Lưu object file vào state để tí gửi đi
            // Tạo URL tạm thời để hiển thị preview
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    // Cleanup URL preview khi component unmount để tránh memory leak
    useEffect(() => {
        return () => {
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [imagePreviewUrl]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        // QUAN TRỌNG: Dùng FormData để gửi file
        const dataToSend = new FormData();
        dataToSend.append('ten_nguyen_lieu', formData.ten_nguyen_lieu);
        dataToSend.append('loai_nguyen_lieu', formData.loai_nguyen_lieu);

        // Chỉ đóng gói file nếu người dùng có chọn ảnh
        if (selectedImageFile) {
            // 'hinh_anh' là tên key mà backend Laravel sẽ hứng: $request->file('hinh_anh')
            dataToSend.append('hinh_anh', selectedImageFile);
        }
        // Nếu không chọn ảnh, không append 'hinh_anh', backend sẽ nhận được null (đúng yêu cầu DB)

        try {
            // Khi gửi FormData, axios thường tự động set header 'Content-Type': 'multipart/form-data'
            await ingredientApi.create(dataToSend);
            alert('Thêm nguyên liệu thành công!');
            navigate('/admin/categories/ingredients');
        } catch (error) {
            console.error(error);
            alert('Lỗi thêm nguyên liệu: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="user-manager-container">
            <h2 className="page-title">Thêm Nguyên Liệu Mới</h2>

             <form onSubmit={handleSubmit} style={{maxWidth: '600px', background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'}}>

                {/* 1. Tên nguyên liệu */}
                <div style={{marginBottom: '20px'}}>
                    <label style={{fontWeight: 'bold', display: 'block', marginBottom: '8px'}}>Tên Nguyên Liệu <span style={{color:'red'}}>*</span>:</label>
                    <input
                        type="text" name="ten_nguyen_lieu" className="search-input" style={{width: '100%'}}
                        placeholder="Ví dụ: Thịt bò, Cà rốt..."
                        value={formData.ten_nguyen_lieu}
                        onChange={handleTextChange}
                        required
                    />
                </div>

                {/* 2. Loại nguyên liệu */}
                <div style={{marginBottom: '20px'}}>
                    <label style={{fontWeight: 'bold', display: 'block', marginBottom: '8px'}}>Loại Nguyên Liệu <span style={{color:'red'}}>*</span>:</label>
                    <select
                        name="loai_nguyen_lieu"
                        className="search-input"
                        style={{width: '100%'}}
                        value={formData.loai_nguyen_lieu}
                        onChange={handleTextChange}
                    >
                        <option value="Thịt">Thịt</option>
                        <option value="Hải sản">Hải sản</option>
                        <option value="Rau củ">Rau củ</option>
                        <option value="Trái cây">Trái cây</option>
                        <option value="Gia vị">Gia vị</option>
                        <option value="Ngũ cốc">Ngũ cốc</option>
                        <option value="Trứng/Sữa">Trứng / Sữa</option>
                        <option value="Khác">Khác</option>
                    </select>
                </div>

                {/* 3. Hình ảnh (Chọn file) */}
                <div style={{marginBottom: '25px'}}>
                    <label style={{fontWeight: 'bold', display: 'block', marginBottom: '8px'}}>
                        <FaImage style={{marginRight:'5px'}}/> Hình ảnh (Tuỳ chọn):
                    </label>

                    {/* Input type="file" */}
                    <input
                        type="file"
                        accept="image/*" // Chỉ cho phép chọn file ảnh
                        className="form-control" // Sử dụng class search-input để có style tương đồng, hoặc dùng form-control của bootstrap
                        style={{width: '100%', padding: '10px'}}
                        onChange={handleImageChange}
                    />
                    <small style={{color:'#666', fontStyle:'italic'}}>Nếu không chọn, hệ thống sẽ để trống (NULL).</small>

                    {/* Preview ảnh nếu có chọn */}
                    {imagePreviewUrl && (
                        <div style={{marginTop: '15px', textAlign:'center', border:'2px dashed #ddd', padding:'10px', borderRadius:'5px'}}>
                            <p style={{margin:'0 0 5px 0', fontSize:'12px', color:'#888'}}>Xem trước:</p>
                            <img src={imagePreviewUrl} alt="Preview" style={{maxHeight: '150px', maxWidth: '100%', borderRadius: '5px'}} />
                        </div>
                    )}
                </div>

                {/* Nút bấm */}
                <div className='d-flex justify-content-end align-items-center gap-2'>
                    <button type="button" className="btn-icon" style={{width: 'auto', padding: '8px 20px', border:'1px solid #ccc', background:'#f8f9fa'}}
                            onClick={() => navigate('/admin/categories/ingredients')}>
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

export default AddIngredient;