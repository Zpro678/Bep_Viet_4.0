import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import createRecipeService from '../api/createRecipeServiceApi'; 
import './CSS/CreateRecipe.css';
import { FaPlus, FaTrash, FaCloudUploadAlt, FaSave, FaImage, FaTimes } from 'react-icons/fa'; 

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // --- 1. STATE LƯU TRỮ DANH MỤC & VÙNG MIỀN ---
  const [categoriesList, setCategoriesList] = useState([]);
  const [regionsList, setRegionsList] = useState([]);

  // State lưu lỗi validation
  const [errors, setErrors] = useState({});

  const [info, setInfo] = useState({
    title: '',            
    description: '',      
    cooking_time: '',     
    servings: '',         
    difficulty: '1',      
    category: '',         
    region: '',           
    video_url: '',        
    tags: ''              
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [steps, setSteps] = useState([{ instruction: '', image: null, imagePreview: null }]);

  // --- 2. GỌI API LẤY DỮ LIỆU ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [catResponse, regResponse] = await Promise.all([
                createRecipeService.getCategories(),
                createRecipeService.getRegions()
            ]);

            if (catResponse && catResponse.data) {
                 const cats = catResponse.data.data ? catResponse.data.data : catResponse.data;
                 setCategoriesList(Array.isArray(cats) ? cats : (cats.data || [])); 
            }

            if (regResponse && regResponse.data) {
                 const regs = regResponse.data.data ? regResponse.data.data : regResponse.data;
                 setRegionsList(Array.isArray(regs) ? regs : (regs.data || []));
            }
        } catch (error) {
            console.error("Lỗi khi tải danh mục/vùng miền:", error);
        }
    };
    fetchData();
  }, []);

  // --- CLEANUP ---
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      steps.forEach(step => { if (step.imagePreview) URL.revokeObjectURL(step.imagePreview); });
    };
  }, [imageFile, steps]);

  // --- HÀM VALIDATE (KIỂM TRA LỖI) ---
  const validateForm = () => {
    const newErrors = {};

    // 1. Kiểm tra thông tin chung
    if (!info.title.trim()) newErrors.title = "Tên món ăn không được để trống";
    if (!info.cooking_time) newErrors.cooking_time = "Thời gian nấu không được để trống";
    else if (info.cooking_time <= 0) newErrors.cooking_time = "Thời gian phải lớn hơn 0";
    
    if (!info.servings) newErrors.servings = "Khẩu phần không được để trống";
    else if (info.servings <= 0) newErrors.servings = "Khẩu phần phải lớn hơn 0";

    if (!info.category) newErrors.category = "Vui lòng chọn danh mục";
    if (!info.region) newErrors.region = "Vui lòng chọn vùng miền";

    // 2. Kiểm tra Nguyên liệu (Phải có ít nhất 1 dòng và điền đủ thông tin)
    const isIngredientsValid = ingredients.every(ing => ing.name.trim() && ing.quantity && ing.unit.trim());
    if (!isIngredientsValid) {
        newErrors.ingredients = "Vui lòng điền đầy đủ Tên, Số lượng và Đơn vị cho tất cả dòng nguyên liệu";
    }

    // 3. Kiểm tra Các bước (Phải có nội dung hướng dẫn)
    const isStepsValid = steps.every(step => step.instruction.trim());
    if (!isStepsValid) {
        newErrors.steps = "Vui lòng nhập nội dung hướng dẫn cho tất cả các bước";
    }

    return newErrors;
  };

  // --- HANDLERS ---
  const handleChangeInfo = (e) => {
    const { name, value } = e.target;
    setInfo(prev => ({ ...prev, [name]: value }));
    
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e) => { const file = e.target.files[0]; if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }};
  const removeCoverImage = (e) => { e.preventDefault(); setImageFile(null); setImagePreview(null); }
  
  const handleIngredientChange = (index, field, value) => { 
      const newList = [...ingredients]; 
      newList[index][field] = value; 
      setIngredients(newList); 
      // Xóa lỗi chung của nguyên liệu nếu người dùng đang sửa
      if(errors.ingredients) setErrors({...errors, ingredients: ''});
  };

  const addIngredient = () => setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  const removeIngredient = (index) => { if (ingredients.length > 1) { setIngredients(ingredients.filter((_, i) => i !== index)); } };
  
  const handleStepChange = (index, value) => { 
      const newList = [...steps]; 
      newList[index].instruction = value; 
      setSteps(newList); 
      // Xóa lỗi chung của bước nếu người dùng đang sửa
      if(errors.steps) setErrors({...errors, steps: ''});
  };

  const handleStepImageChange = (index, e) => { const file = e.target.files[0]; if (file) { const newList = [...steps]; newList[index].image = file; newList[index].imagePreview = URL.createObjectURL(file); setSteps(newList); } };
  const addStep = () => setSteps([...steps, { instruction: '', image: null, imagePreview: null }]);
  const removeStep = (index) => { if (steps.length > 1) { setSteps(steps.filter((_, i) => i !== index)); } };

  // --- SUBMIT FORM ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. CHẠY VALIDATE TRƯỚC KHI GỬI
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        // Cuộn trang lên đầu để người dùng thấy lỗi (tùy chọn)
        window.scrollTo(0, 0);
        return;
    }

    setLoading(true);
    const formData = new FormData();

    // Append dữ liệu (giữ nguyên logic cũ)
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
    
    if (imageFile) formData.append('hinh_anh_bia', imageFile);

    ingredients.forEach((ing, index) => { 
        formData.append(`nguyen_lieu[${index}][ten_nguyen_lieu]`, ing.name); 
        formData.append(`nguyen_lieu[${index}][dinh_luong]`, ing.quantity); 
        formData.append(`nguyen_lieu[${index}][don_vi_tinh]`, ing.unit); 
    });

    steps.forEach((step, index) => { 
        formData.append(`cac_buoc[${index}][noi_dung]`, step.instruction); 
        if (step.image) formData.append(`cac_buoc[${index}][hinh_anh]`, step.image); 
    });

    try {
      const response = await createRecipeService.create(formData);
      
      // --- THÊM DÒNG NÀY ĐỂ KIỂM TRA ---
      console.log("🔥 Kết quả trả về từ API:", response); 
      // Bạn mở F12 xem nó in ra cái gì.
      // Nếu nó in ra data luôn (không có .status) thì code cũ của bạn bị sai điều kiện.

      // --- SỬA LẠI ĐIỀU KIỆN KIỂM TRA ---
      // Kiểm tra lỏng hơn: Chỉ cần có response trả về là coi như thành công
      // (Vì nếu lỗi thì nó đã nhảy xuống catch rồi)
      if (response) { 
          // Dùng setTimeout để chắc chắn alert hiện ra trước khi chuyển trang
          setTimeout(() => {
              alert("🎉 Công thức đã được gửi duyệt thành công!");
          }, 100);
      }

    } catch (error) {
      console.error("Lỗi:", error);
      const message = error.response?.data?.message || "Có lỗi xảy ra, vui lòng kiểm tra lại.";
      alert("Lỗi: " + message);
    } finally {
      setLoading(false);
    }
  };

  // Style nội bộ cho text lỗi (nếu trong CSS chưa có class .error-text)
  const errorStyle = { color: 'red', fontSize: '0.85rem', marginTop: '5px', display: 'block' };

  return (
    <div className="create-recipe-container">
      <h2>Tạo Công Thức Mới 🍳</h2>

      {/* Bỏ validate mặc định của HTML5 (noValidate) để dùng validate JS của mình */}
      <form onSubmit={handleSubmit} noValidate> 
        <div className="form-section">
          <h3>Thông tin chung</h3>
          <div className="form-group">
            <label>Tên món ăn (*)</label>
            <input 
                type="text" 
                name="title" 
                value={info.title} 
                onChange={handleChangeInfo} 
                placeholder="Ví dụ: Phở Bò" 
                // Thêm border đỏ nếu có lỗi
                style={errors.title ? {borderColor: 'red'} : {}}
            />
            {errors.title && <span style={errorStyle}>{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Mô tả ngắn</label>
            <textarea name="description" value={info.description} onChange={handleChangeInfo} placeholder="Mô tả..." rows="3"></textarea>
          </div>

          <div className="form-group">
             <label>Link Video (Nếu có)</label>
             <input type="url" name="video_url" value={info.video_url} onChange={handleChangeInfo} placeholder="https://..." />
          </div>

          <div className="form-group">
              <label>Thẻ (Tags)</label>
              <input type="text" name="tags" value={info.tags} onChange={handleChangeInfo} placeholder="VD: Cay, Mùa hè..." />
          </div>
          
          <div className="form-row">
             <div className="form-group">
              <label>Khẩu phần (*)</label>
              <input 
                type="number" 
                name="servings" 
                value={info.servings} 
                onChange={handleChangeInfo} 
                min="1" 
                style={errors.servings ? {borderColor: 'red'} : {}}
              />
              {errors.servings && <span style={errorStyle}>{errors.servings}</span>}
            </div>
            <div className="form-group">
              <label>Thời gian (phút) (*)</label>
              <input 
                type="number" 
                name="cooking_time" 
                value={info.cooking_time} 
                onChange={handleChangeInfo} 
                min="1" 
                style={errors.cooking_time ? {borderColor: 'red'} : {}}
              />
              {errors.cooking_time && <span style={errorStyle}>{errors.cooking_time}</span>}
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
              <label>Danh mục (*)</label>
              <select 
                name="category" 
                value={info.category} 
                onChange={handleChangeInfo}
                style={errors.category ? {borderColor: 'red'} : {}}
              >
                <option value="">-- Chọn danh mục --</option>
                {categoriesList.map((cat) => (
                    <option key={cat.ma_danh_muc} value={cat.ma_danh_muc}>{cat.ten_danh_muc}</option>
                ))}
              </select>
              {errors.category && <span style={errorStyle}>{errors.category}</span>}
            </div>

            <div className="form-group">
              <label>Vùng miền (*)</label>
              <select 
                name="region" 
                value={info.region} 
                onChange={handleChangeInfo}
                style={errors.region ? {borderColor: 'red'} : {}}
              >
                <option value="">-- Chọn vùng miền --</option>
                {regionsList.map((reg) => (
                    <option key={reg.ma_vung_mien} value={reg.ma_vung_mien}>{reg.ten_vung_mien}</option>
                ))}
              </select>
              {errors.region && <span style={errorStyle}>{errors.region}</span>}
            </div>
          </div>

           <div className="form-group">
            <label>Ảnh bìa món ăn</label>
            <div className={`image-upload-box ${imagePreview ? 'has-image' : ''}`}>
              <input type="file" id="recipe-img" accept="image/*" onChange={handleImageChange} hidden />
              <label htmlFor="recipe-img" className="upload-label">
                {imagePreview ? (
                  <div className="preview-container" style={{position: 'relative', width: '100%', height: '100%'}}>
                    <img src={imagePreview} alt="Preview" className="img-preview" />
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
              {imagePreview && (
                  <button type="button" onClick={removeCoverImage} style={{position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red'}} title="Xóa ảnh"><FaTimes /></button>
              )}
            </div>
          </div>
        </div>

        {/* NGUYÊN LIỆU */}
        <div className="form-section">
            <h3>Nguyên liệu</h3>
            {/* Hiển thị lỗi chung cho phần nguyên liệu */}
            {errors.ingredients && <div style={{...errorStyle, marginBottom: '10px', fontWeight: 'bold'}}>{errors.ingredients}</div>}
            
            {ingredients.map((ing, index) => (
            <div key={index} className="dynamic-row">
                <input type="text" placeholder="Tên nguyên liệu" value={ing.name} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} className="input-wide" />
                <input type="number" placeholder="SL" value={ing.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} className="input-small" min="0" step="any" />
                <input type="text" placeholder="Đơn vị" value={ing.unit} onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)} className="input-small" />
                {ingredients.length > 1 && (<button type="button" className="btn-remove" onClick={() => removeIngredient(index)}><FaTrash /></button>)}
            </div>
            ))}
            <button type="button" className="btn-add-more" onClick={addIngredient}><FaPlus /> Thêm nguyên liệu</button>
        </div>

        {/* CÁC BƯỚC */}
        <div className="form-section">
            <h3>Các bước thực hiện</h3>
            {/* Hiển thị lỗi chung cho phần các bước */}
            {errors.steps && <div style={{...errorStyle, marginBottom: '10px', fontWeight: 'bold'}}>{errors.steps}</div>}
            
            {steps.map((step, index) => (
            <div key={index} className="step-row" style={{ alignItems: 'start' }}>
                <span className="step-number" style={{color:'white'}}>Bước {index + 1}</span>
                <div className="step-inputs">
                <textarea placeholder={`Hướng dẫn bước ${index + 1}...`} value={step.instruction} onChange={(e) => handleStepChange(index, e.target.value)} rows="3" />
                <div className="step-image-upload">
                    <label htmlFor={`step-img-${index}`} className="step-img-label"><FaImage /> {step.image ? 'Đổi ảnh' : 'Thêm ảnh minh họa'}</label>
                    <input type="file" id={`step-img-${index}`} accept="image/*" onChange={(e) => handleStepImageChange(index, e)} hidden />
                    {step.imagePreview && (<div className="step-img-preview-box"><img src={step.imagePreview} alt={`Step ${index + 1}`} /></div>)}
                </div>
                </div>
                {steps.length > 1 && (<button type="button" className="btn-remove" style={{marginTop: '0'}} onClick={() => removeStep(index)}><FaTrash /></button>)}
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