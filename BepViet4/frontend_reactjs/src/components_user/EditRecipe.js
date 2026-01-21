import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import recipeDetailService from '../api/recipeDetailService';
import createRecipeServiceApi from '../api/createRecipeServiceApi';
import { FaPlus, FaTrash, FaCloudUploadAlt, FaSave, FaImage } from 'react-icons/fa';
import './CSS/EditRecipe.css';

const STORAGE_URL = 'http://localhost:8000/storage/';

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State lưu thông tin chung
  const [info, setInfo] = useState({
    title: '',
    description: '',
    video_url: '',
    tags: '',
    servings: '',
    cooking_time: '',
    difficulty: '1',
    category: '1',
    region: '1'
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // State nguyên liệu
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  
  // State các bước
  const [steps, setSteps] = useState([{ instruction: '', image: null, imagePreview: null }]);

  // --- 1. FETCH DATA TỪ BACKEND ---
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await recipeDetailService.getById(id);
        const d = response.data; // Dữ liệu trả về từ API

        // Map thông tin chung
        setInfo({
          title: d.ten_mon || '',
          description: d.mo_ta || '',
          // Kiểm tra cấu trúc video trả về (mảng hoặc object)
          video_url: d.video?.[0]?.duong_dan_video || d.video?.duong_dan_video || '', 
          tags: d.the?.map(t => t.ten_the).join(', ') || '',
          servings: d.khau_phan || '',
          cooking_time: d.thoi_gian_nau || '',
          difficulty: d.do_kho?.toString() || '1',
          category: d.ma_danh_muc?.toString() || '1',
          region: d.ma_vung_mien?.toString() || '1'
        });

        // Map ảnh bìa
        if (d.hinh_anh?.[0]) {
            setImagePreview(`${STORAGE_URL}${d.hinh_anh[0].duong_dan}`);
        }

        // Map nguyên liệu (Chú ý pivot data)
        if (d.nguyen_lieu) {
          setIngredients(d.nguyen_lieu.map(ing => ({
            name: ing.ten_nguyen_lieu,
            quantity: ing.pivot?.dinh_luong || '', // Backend trả về dinh_luong
            unit: ing.pivot?.don_vi_tinh || ''      // Backend trả về don_vi_tinh
          })));
        }

        // Map các bước thực hiện
        if (d.buoc_thuc_hien) { // Hoặc d.cac_buoc tùy API trả về
            // Sắp xếp theo thứ tự bước để hiển thị đúng
            const sortedSteps = d.buoc_thuc_hien.sort((a, b) => a.so_thu_tu - b.so_thu_tu);
            setSteps(sortedSteps.map(s => ({
                instruction: s.noi_dung, // Backend trả về noi_dung
                image: null,
                // Lấy ảnh đầu tiên của bước đó nếu có
                imagePreview: s.hinh_anh_buoc?.[0] 
                    ? `${STORAGE_URL}${s.hinh_anh_buoc[0].duong_dan}` 
                    : (s.hinh_anh?.[0] ? `${STORAGE_URL}${s.hinh_anh[0].duong_dan}` : null)
            })));
        }
      } catch (error) {
        console.error("Lỗi khi tải công thức:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  // --- 2. XỬ LÝ SUBMIT (QUAN TRỌNG NHẤT) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formData = new FormData();
    // formData.append('_method', 'POST'); // Giả lập PUT request cho Laravel
  
    // Map các trường thông tin chung sang tên biến Backend mong đợi
    formData.append('ten_mon', info.title);
    formData.append('mo_ta', info.description);
    formData.append('thoi_gian_nau', info.cooking_time);
    formData.append('khau_phan', info.servings);
    formData.append('do_kho', info.difficulty);
    formData.append('ma_danh_muc', info.category);
    formData.append('ma_vung_mien', info.region);
    
    if (info.video_url) {
        formData.append('video_url', info.video_url);
    }

    // Xử lý Tags
    if (info.tags) {
        info.tags.split(',').forEach(t => {
            if (t.trim()) formData.append('tags[]', t.trim());
        });
    }
  
    // Xử lý Ảnh bìa (Chỉ gửi nếu có chọn file mới)
    if (imageFile) {
      formData.append('hinh_anh_bia', imageFile);
    }
  
    // Xử lý Nguyên Liệu (Quan trọng: Map đúng key dinh_luong, don_vi_tinh)
    ingredients.forEach((ing, i) => {
      formData.append(`nguyen_lieu[${i}][ten_nguyen_lieu]`, ing.name);
      formData.append(`nguyen_lieu[${i}][dinh_luong]`, ing.quantity); // Key Backend: dinh_luong
      formData.append(`nguyen_lieu[${i}][don_vi_tinh]`, ing.unit);   // Key Backend: don_vi_tinh
    });
  
    // Xử lý Các Bước (Quan trọng: Map đúng key noi_dung, hinh_anh)
    steps.forEach((s, i) => {
      formData.append(`cac_buoc[${i}][noi_dung]`, s.instruction); // Key Backend: noi_dung
      
      // Chỉ gửi ảnh nếu người dùng upload file mới (là object File)
      if (s.image && s.image instanceof File) {
        formData.append(`cac_buoc[${i}][hinh_anh]`, s.image); // Key Backend: hinh_anh
      }
    });
  
    try {
      await createRecipeServiceApi.update(id, formData);
      alert("Cập nhật thành công!");
      navigate('/profile');
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật! Vui lòng kiểm tra lại thông tin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="create-recipe-container">
      <h2 className="main-title">Chỉnh Sửa Công Thức 🍳</h2>
      <form onSubmit={handleSubmit}>
        
        {/* Thông tin chung */}
        <div className="form-section card">
          <h3 className="section-title">Thông tin chung</h3>
          
          <div className="form-group">
            <label>Tên món ăn (*)</label>
            <input required type="text" placeholder="Ví dụ: Phở Bò Nam Định" value={info.title} onChange={(e) => setInfo({...info, title: e.target.value})} />
          </div>

          <div className="form-group">
            <label>Mô tả ngắn</label>
            <textarea placeholder="Mô tả hương vị, nguồn gốc..." value={info.description} onChange={(e) => setInfo({...info, description: e.target.value})} rows="3"></textarea>
          </div>

          <div className="form-group">
            <label>Link Video hướng dẫn (Nếu có)</label>
            <input type="url" placeholder="https://youtube.com/..." value={info.video_url} onChange={(e) => setInfo({...info, video_url: e.target.value})} />
          </div>

          <div className="form-group">
            <label>Thẻ (Tags) - Ngăn cách bằng dấu phẩy</label>
            <input type="text" placeholder="VD: Món cay, Cuối tuần, Giảm cân" value={info.tags} onChange={(e) => setInfo({...info, tags: e.target.value})} />
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label>Khẩu phần (người)</label>
              <input type="number" min="1" value={info.servings} onChange={(e) => setInfo({...info, servings: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Thời gian (phút)</label>
              <input type="number" min="1" value={info.cooking_time} onChange={(e) => setInfo({...info, cooking_time: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Độ khó</label>
              <select value={info.difficulty} onChange={(e) => setInfo({...info, difficulty: e.target.value})}>
                <option value="1">1 - Rất Dễ</option>
                <option value="2">2 - Dễ</option>
                <option value="3">3 - Vừa</option>
                <option value="4">4 - Khó</option>
                <option value="5">5 - Rất Khó</option>
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Danh mục</label>
              <select value={info.category} onChange={(e) => setInfo({...info, category: e.target.value})}>
                <option value="1">Món Canh</option>
                <option value="2">Món Kho</option>
                <option value="3">Món Xào</option>
                {/* Thêm các option khác nếu có */}
              </select>
            </div>
            <div className="form-group">
              <label>Vùng miền</label>
              <select value={info.region} onChange={(e) => setInfo({...info, region: e.target.value})}>
                <option value="1">Miền Bắc</option>
                <option value="2">Miền Trung</option>
                <option value="3">Miền Nam</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Ảnh bìa món ăn</label>
            <div className="image-upload-box">
              <input type="file" id="recipe-img" accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if(file) {
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }} hidden />
              <label htmlFor="recipe-img" className="upload-label">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="img-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <FaCloudUploadAlt size={40} />
                    <span>Nhấn để chọn ảnh bìa mới</span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* --- PHẦN NGUYÊN LIỆU --- */}
        <div className="form-section card">
          <h3 className="section-title">Nguyên liệu</h3>
          {ingredients.map((ing, index) => (
            <div key={index} className="dynamic-row">
              <input className="input-wide" placeholder="Tên nguyên liệu" value={ing.name} onChange={(e) => {
                const newList = [...ingredients];
                newList[index].name = e.target.value;
                setIngredients(newList);
              }} required />
              
              <input 
                type="number" 
                step="any"
                min="0"
                className="input-small" 
                placeholder="SL" 
                value={ing.quantity} 
                onChange={(e) => {
                  const newList = [...ingredients];
                  newList[index].quantity = e.target.value;
                  setIngredients(newList);
                }} 
                required 
              />
              
              <input className="input-small" placeholder="Đơn vị" value={ing.unit} onChange={(e) => {
                const newList = [...ingredients];
                newList[index].unit = e.target.value;
                setIngredients(newList);
              }} required />
              
              <button type="button" className="btn-remove" onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}><FaTrash /></button>
            </div>
          ))}
          <button type="button" className="btn-add-more" onClick={() => setIngredients([...ingredients, {name:'', quantity:'', unit:''}])}>
            <FaPlus /> Thêm nguyên liệu
          </button>
        </div>

        {/* --- PHẦN CÁC BƯỚC --- */}
        <div className="form-section card">
          <h3 className="section-title">Các bước thực hiện</h3>
          {steps.map((step, index) => (
            <div key={index} className="step-container">
               <div className="step-header">
                  <span className="step-badge">BƯỚC {index + 1}</span>
                  <button type="button" className="btn-remove-step" onClick={() => setSteps(steps.filter((_, i) => i !== index))}><FaTrash /></button>
               </div>
               <textarea 
                 placeholder={`Hướng dẫn bước ${index + 1}...`} 
                 value={step.instruction} 
                 onChange={(e) => {
                    const newList = [...steps];
                    newList[index].instruction = e.target.value;
                    setSteps(newList);
                 }} 
                 required 
               />
               <div className="step-img-upload">
                  <input type="file" id={`step-file-${index}`} onChange={(e) => {
                    const file = e.target.files[0];
                    if(file) {
                        const newList = [...steps];
                        newList[index].image = file;
                        newList[index].imagePreview = URL.createObjectURL(file);
                        setSteps(newList);
                    }
                  }} hidden />
                  <label htmlFor={`step-file-${index}`} className="step-img-label">
                    <FaImage /> {step.imagePreview ? "Thay đổi ảnh minh họa" : "Thêm ảnh minh họa"}
                  </label>
                  {step.imagePreview && <img src={step.imagePreview} alt="Step" className="step-preview-img" />}
               </div>
            </div>
          ))}
          <button type="button" className="btn-add-more" onClick={() => setSteps([...steps, {instruction:'', image:null, imagePreview:null}])}>
            <FaPlus /> Thêm bước thực hiện
          </button>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Hủy bỏ</button>
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : <><FaSave /> Lưu thay đổi</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipe;