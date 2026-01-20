import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// --- THAY ĐỔI 1: Import service chuyên biệt cho việc tạo bài ---
import { createRecipeService } from '../services/createRecipeService'; 
import './CSS/CreateRecipe.css';
import { FaPlus, FaTrash, FaCloudUploadAlt, FaSave } from 'react-icons/fa';

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // 1. State thông tin chung
  const [info, setInfo] = useState({
    title: '',
    description: '',
    cooking_time: '',
    servings: '',
    difficulty: 'Dễ',
    category: 'Món kho',
    region: 'Miền Bắc',
    video_url: ''
  });

  // 2. State Ảnh bìa
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // 3. State Nguyên liệu (Mảng động)
  const [ingredients, setIngredients] = useState([
    { name: '', quantity: '', unit: '' }
  ]);

  // 4. State Các bước (Mảng động)
  const [steps, setSteps] = useState([
    { instruction: '', time: '' }
  ]);

  // --- HÀM XỬ LÝ ---

  // Xử lý thay đổi thông tin chung
  const handleChangeInfo = (e) => {
    const { name, value } = e.target;
    setInfo(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Preview ảnh ngay lập tức
    }
  };

  // --- LOGIC NGUYÊN LIỆU ---
  const handleIngredientChange = (index, field, value) => {
    const newList = [...ingredients];
    newList[index][field] = value;
    setIngredients(newList);
  };
  const addIngredient = () => setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  const removeIngredient = (index) => {
    if(ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  // --- LOGIC CÁC BƯỚC ---
  const handleStepChange = (index, field, value) => {
    const newList = [...steps];
    newList[index][field] = value;
    setSteps(newList);
  };
  const addStep = () => setSteps([...steps, { instruction: '', time: '' }]);
  const removeStep = (index) => {
    if(steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  // --- SUBMIT FORM ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Chuẩn bị FormData để gửi sang Laravel (Laravel xử lý FormData tốt nhất)
    const formData = new FormData();

    // 1. Append thông tin cơ bản
    formData.append('title', info.title);
    formData.append('description', info.description);
    formData.append('cooking_time', info.cooking_time);
    formData.append('servings', info.servings);
    formData.append('difficulty', info.difficulty);
    formData.append('category_name', info.category);
    formData.append('region_name', info.region);
    formData.append('video_url', info.video_url);

    // 2. Append Ảnh (quan trọng)
    if (imageFile) {
      formData.append('image', imageFile);
    }

    // 3. Append Nguyên liệu & Các bước (Gửi dạng JSON string)
    formData.append('ingredients', JSON.stringify(ingredients)); 
    formData.append('steps', JSON.stringify(steps));
    
    try {
      // --- THAY ĐỔI 2: Gọi service createRecipeService ---
      await createRecipeService.create(formData);
      
      alert("Đăng công thức thành công!");
      navigate('/profile'); // Chuyển về trang cá nhân
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi đăng bài!");
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

          <div className="form-row">
             <div className="form-group">
                <label>Khẩu phần (người)</label>
                <input type="number" name="servings" value={info.servings} onChange={handleChangeInfo} />
             </div>
             <div className="form-group">
                <label>Thời gian (phút)</label>
                <input type="number" name="cooking_time" value={info.cooking_time} onChange={handleChangeInfo} />
             </div>
             <div className="form-group">
                <label>Độ khó</label>
                <select name="difficulty" value={info.difficulty} onChange={handleChangeInfo}>
                  <option>Dễ</option>
                  <option>Vừa</option>
                  <option>Khó</option>
                </select>
             </div>
          </div>

          <div className="form-row">
            <div className="form-group">
               <label>Danh mục</label>
               <select name="category" value={info.category} onChange={handleChangeInfo}>
                  <option>Món kho</option>
                  <option>Món canh</option>
                  <option>Món xào</option>
                  <option>Ăn vặt</option>
               </select>
            </div>
            <div className="form-group">
               <label>Vùng miền</label>
               <select name="region" value={info.region} onChange={handleChangeInfo}>
                  <option>Miền Bắc</option>
                  <option>Miền Trung</option>
                  <option>Miền Nam</option>
                  <option>Không rõ</option>
               </select>
            </div>
          </div>
          
          {/* UPLOAD ẢNH */}
          <div className="form-group">
            <label>Ảnh bìa món ăn</label>
            <div className="image-upload-box">
              <input type="file" id="recipe-img" accept="image/*" onChange={handleImageChange} hidden />
              <label htmlFor="recipe-img" className="upload-label">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="img-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <FaCloudUploadAlt size={40} />
                    <span>Nhấn để chọn ảnh</span>
                  </div>
                )}
              </label>
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
              />
              <input 
                type="number" 
                placeholder="SL" 
                value={ing.quantity} 
                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                className="input-small" 
              />
              <input 
                type="text" 
                placeholder="Đơn vị" 
                value={ing.unit} 
                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                className="input-small" 
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
            <div key={index} className="step-row">
              <span className="step-number">Bước {index + 1}</span>
              <div className="step-inputs">
                <textarea 
                  placeholder={`Hướng dẫn bước ${index + 1}...`}
                  value={step.instruction}
                  onChange={(e) => handleStepChange(index, 'instruction', e.target.value)}
                />
                <div className="step-time">
                  <input 
                      type="number" placeholder="Phút" 
                      value={step.time} 
                      onChange={(e) => handleStepChange(index, 'time', e.target.value)}
                  />
                  <span>phút</span>
                </div>
              </div>
              {steps.length > 1 && (
                <button type="button" className="btn-remove" onClick={() => removeStep(index)}><FaTrash /></button>
              )}
            </div>
          ))}
          <button type="button" className="btn-add-more" onClick={addStep}><FaPlus /> Thêm bước thực hiện</button>
        </div>

        <div className="form-actions">
           <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Hủy bỏ</button>
           <button type="submit" className="btn-submit" disabled={loading}>
             {loading ? 'Đang xử lý...' : <><FaSave /> Đăng công thức</>}
           </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;