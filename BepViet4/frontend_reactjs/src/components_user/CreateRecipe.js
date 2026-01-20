import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { createRecipeService } from '../api/createRecipeServiceApi';
import './CSS/CreateRecipe.css';
import { FaPlus, FaTrash, FaCloudUploadAlt, FaSave, FaImage, FaTimes } from 'react-icons/fa'; 

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [info, setInfo] = useState({
    title: '',            // -> ten_mon
    description: '',      // -> mo_ta
    cooking_time: '',     // -> thoi_gian_nau
    servings: '',         // -> khau_phan
    difficulty: '1',      // -> do_kho
    category: '1',        // -> ma_danh_muc
    region: '1',          // -> ma_vung_mien
    video_url: '',        // -> video_url
    tags: ''              // -> tags
  });

  // Ảnh bìa
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Nguyên liệu
  const [ingredients, setIngredients] = useState([
    { name: '', quantity: '', unit: '' }
  ]);

  // Các bước
  const [steps, setSteps] = useState([
    { instruction: '', image: null, imagePreview: null }
  ]);

  // --- 2. HÀM CLEANUP (QUAN TRỌNG) ---
  // Tự động xóa URL preview khi component unmount hoặc file thay đổi để tránh rò rỉ bộ nhớ
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      steps.forEach(step => {
        if (step.imagePreview) URL.revokeObjectURL(step.imagePreview);
      });
    };
  }, [imageFile, steps]);

  // --- HÀM XỬ LÝ INPUT ---
  const handleChangeInfo = (e) => {
    const { name, value } = e.target;
    setInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Tạo URL preview
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeCoverImage = (e) => {
    e.preventDefault(); // Chặn sự kiện click nhầm vào input file
    setImageFile(null);
    setImagePreview(null);
  }

  // --- LOGIC NGUYÊN LIỆU ---
  const handleIngredientChange = (index, field, value) => {
    const newList = [...ingredients];
    newList[index][field] = value;
    setIngredients(newList);
  };
  const addIngredient = () => setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  // --- LOGIC CÁC BƯỚC ---
  const handleStepChange = (index, value) => {
    const newList = [...steps];
    newList[index].instruction = value;
    setSteps(newList);
  };

  const handleStepImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newList = [...steps];
      newList[index].image = file;
      newList[index].imagePreview = URL.createObjectURL(file);
      setSteps(newList);
    }
  };

  const addStep = () => setSteps([...steps, { instruction: '', image: null, imagePreview: null }]);
  const removeStep = (index) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  // --- SUBMIT FORM ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    // 1. Map thông tin
    formData.append('ten_mon', info.title);
    formData.append('mo_ta', info.description);
    formData.append('thoi_gian_nau', info.cooking_time);
    formData.append('khau_phan', info.servings);
    formData.append('do_kho', info.difficulty);
    formData.append('ma_danh_muc', info.category);
    formData.append('ma_vung_mien', info.region);
    
    if (info.video_url) formData.append('video_url', info.video_url);

    if (info.tags) {
      const tagArray = info.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      tagArray.forEach(tag => formData.append('tags[]', tag));
    }

    // 2. Ảnh bìa
    if (imageFile) {
      formData.append('hinh_anh_bia', imageFile);
    }

    // 3. Nguyên liệu (Dùng dinh_luong)
    ingredients.forEach((ing, index) => {
      formData.append(`nguyen_lieu[${index}][ten_nguyen_lieu]`, ing.name);
      formData.append(`nguyen_lieu[${index}][dinh_luong]`, ing.quantity);
      formData.append(`nguyen_lieu[${index}][don_vi_tinh]`, ing.unit);
    });

    // 4. Các bước
    steps.forEach((step, index) => {
      formData.append(`cac_buoc[${index}][noi_dung]`, step.instruction);
      if (step.image) {
        formData.append(`cac_buoc[${index}][hinh_anh]`, step.image);
      }
    });

    try {
      const response = await createRecipeService.create(formData);
      console.log("Server response:", response);
      
      if(response.status === 'success' || response.status === 201) {
          alert("Công thức đang chờ duyệt!");
          navigate('/profile'); 
      }
    } catch (error) {
      console.error("Lỗi:", error);
      const message = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
      alert("Lỗi: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-recipe-container">
      <h2>Tạo Công Thức Mới 🍳</h2>

      <form onSubmit={handleSubmit}>
        {/* 1. THÔNG TIN CƠ BẢN */}
        <div className="form-section">
          <h3>Thông tin chung</h3>
          <div className="form-group">
            <label>Tên món ăn (*)</label>
            <input required type="text" name="title" value={info.title} onChange={handleChangeInfo} placeholder="Ví dụ: Phở Bò Nam Định" />
          </div>

          <div className="form-group">
            <label>Mô tả ngắn</label>
            <textarea name="description" value={info.description} onChange={handleChangeInfo} placeholder="Mô tả hương vị, nguồn gốc..." rows="3"></textarea>
          </div>

          <div className="form-group">
            <label>Link Video hướng dẫn (Nếu có)</label>
            <input type="url" name="video_url" value={info.video_url} onChange={handleChangeInfo} placeholder="https://youtube.com/..." />
          </div>

          <div className="form-group">
             <label>Thẻ (Tags) - Ngăn cách bằng dấu phẩy</label>
             <input type="text" name="tags" value={info.tags} onChange={handleChangeInfo} placeholder="VD: Món cay, Cuối tuần, Giảm cân" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Khẩu phần (người)</label>
              <input type="number" name="servings" value={info.servings} onChange={handleChangeInfo} required min="1" />
            </div>
            <div className="form-group">
              <label>Thời gian (phút)</label>
              <input type="number" name="cooking_time" value={info.cooking_time} onChange={handleChangeInfo} required min="1" />
            </div>
            <div className="form-group">
              <label>Độ khó</label>
              <select name="difficulty" value={info.difficulty} onChange={handleChangeInfo}>
                <option value="1">1 - Rất Dễ</option>
                <option value="2">2 - Dễ</option>
                <option value="3">3 - Vừa</option>
                <option value="4">4 - Khó</option>
                <option value="5">5 - Rất Khó</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Danh mục</label>
              <select name="category" value={info.category} onChange={handleChangeInfo}>
                <option value="1">Món kho</option>
                <option value="2">Món canh</option>
                <option value="3">Món xào</option>
                <option value="4">Ăn vặt</option>
              </select>
            </div>
            <div className="form-group">
              <label>Vùng miền</label>
              <select name="region" value={info.region} onChange={handleChangeInfo}>
                <option value="1">Miền Bắc</option>
                <option value="2">Miền Trung</option>
                <option value="3">Miền Nam</option>
              </select>
            </div>
          </div>

          {/* UPLOAD ẢNH BÌA - Đã chỉnh sửa UI để dễ thay đổi ảnh */}
          <div className="form-group">
            <label>Ảnh bìa món ăn</label>
            <div className={`image-upload-box ${imagePreview ? 'has-image' : ''}`}>
              <input type="file" id="recipe-img" accept="image/*" onChange={handleImageChange} hidden />
              <label htmlFor="recipe-img" className="upload-label">
                {imagePreview ? (
                  <div className="preview-container" style={{position: 'relative', width: '100%', height: '100%'}}>
                    <img src={imagePreview} alt="Preview" className="img-preview" />
                    {/* Overlay hướng dẫn đổi ảnh */}
                    <div className="image-overlay" style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', color: 'white',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        opacity: 0, transition: 'opacity 0.3s', cursor: 'pointer'
                    }} 
                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                    >
                        <FaCloudUploadAlt size={30} />
                        <span>Nhấn để đổi ảnh khác</span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <FaCloudUploadAlt size={40} />
                    <span>Nhấn để chọn ảnh</span>
                  </div>
                )}
              </label>
              
              {/* Nút xóa ảnh nếu đã chọn */}
              {imagePreview && (
                  <button 
                    type="button" 
                    onClick={removeCoverImage}
                    style={{
                        position: 'absolute', top: '10px', right: '10px',
                        background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%',
                        width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red'
                    }}
                    title="Xóa ảnh"
                  >
                      <FaTimes />
                  </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. NGUYÊN LIỆU */}
        <div className="form-section">
          <h3>Nguyên liệu</h3>
          {ingredients.map((ing, index) => (
            <div key={index} className="dynamic-row">
              <input
                type="text"
                placeholder="Tên nguyên liệu"
                value={ing.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                className="input-wide"
                required
              />
              <input
                type="number"
                placeholder="SL"
                value={ing.quantity}
                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                className="input-small"
                required
                min="0"
                step="any"
              />
              <input
                type="text"
                placeholder="Đơn vị"
                value={ing.unit}
                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                className="input-small"
                required
              />
              {ingredients.length > 1 && (
                <button type="button" className="btn-remove" onClick={() => removeIngredient(index)}><FaTrash /></button>
              )}
            </div>
          ))}
          <button type="button" className="btn-add-more" onClick={addIngredient}><FaPlus /> Thêm nguyên liệu</button>
        </div>

        {/* 3. CÁC BƯỚC THỰC HIỆN */}
        <div className="form-section">
          <h3>Các bước thực hiện</h3>
          {steps.map((step, index) => (
            <div key={index} className="step-row" style={{ alignItems: 'start' }}>
              <span className="step-number" style={{color:'white'}}>Bước {index + 1}</span>
              <div className="step-inputs">
                <textarea
                  placeholder={`Hướng dẫn bước ${index + 1}...`}
                  value={step.instruction}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  rows="3"
                  required
                />
                
                <div className="step-image-upload">
                    <label htmlFor={`step-img-${index}`} className="step-img-label">
                        <FaImage /> {step.image ? 'Đổi ảnh' : 'Thêm ảnh minh họa'}
                    </label>
                    <input 
                        type="file" 
                        id={`step-img-${index}`} 
                        accept="image/*" 
                        onChange={(e) => handleStepImageChange(index, e)} 
                        hidden 
                    />
                    {step.imagePreview && (
                        <div className="step-img-preview-box">
                            <img src={step.imagePreview} alt={`Step ${index + 1}`} />
                        </div>
                    )}
                </div>
              </div>

              {steps.length > 1 && (
                <button type="button" className="btn-remove" style={{marginTop: '0'}} onClick={() => removeStep(index)}><FaTrash /></button>
              )}
            </div>
          ))}
          <button type="button" className="btn-add-more" onClick={addStep}><FaPlus /> Thêm bước thực hiện</button>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Hủy bỏ</button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Đang tải lên...' : <><FaSave /> Đăng công thức</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;