import React, { useState, useEffect, useRef } from 'react';
import { postService } from '../services/postService';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaImage, FaTimes } from 'react-icons/fa';
import './CSS/Home.css';

// --- CẤU HÌNH ĐƯỜNG DẪN ẢNH ---
const API_BASE_URL = 'http://localhost:8000'; 

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

// --- COMPONENT 1: MODAL TẠO BÀI VIẾT (ĐÃ NÂNG CẤP NHIỀU ẢNH) ---
const CreatePostModal = ({ isOpen, onClose, onPostCreated, currentUser }) => {
  const [tieuDe, setTieuDe] = useState(''); 
  const [noiDung, setNoiDung] = useState('');
  // Thay đổi: Dùng mảng để chứa nhiều ảnh
  const [selectedImages, setSelectedImages] = useState([]); 
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Xóa URL ảo khi unmount hoặc khi danh sách ảnh thay đổi
  useEffect(() => {
    return () => {
        previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]); 

  const handleClose = () => {
    setTieuDe('');
    setNoiDung('');
    setSelectedImages([]);
    setPreviewUrls([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Chuyển FileList sang Array
    if (files.length > 0) {
      // Validate sơ bộ
      const validFiles = files.filter(file => file.type.startsWith('image/'));
      
      if (validFiles.length < files.length) {
         alert('Một số file không phải là ảnh và đã bị loại bỏ.');
      }

      // Cập nhật state (Nối thêm vào ảnh cũ hoặc thay thế tùy logic, ở đây mình làm nối thêm)
      setSelectedImages(prev => [...prev, ...validFiles]);

      // Tạo URL preview mới
      const newUrls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);

    const newUrls = [...previewUrls];
    URL.revokeObjectURL(newUrls[index]); // Xóa memory
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
    
    // Reset input để có thể chọn lại file vừa xóa nếu muốn
    if (fileInputRef.current) fileInputRef.current.value = ''; 
  };

  const handleSubmit = async () => {
    if (!tieuDe.trim() || !noiDung.trim()) {
        alert("Vui lòng nhập tiêu đề và nội dung!");
        return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('tieu_de', tieuDe); 
      formData.append('noi_dung', noiDung);

      // --- QUAN TRỌNG: Append từng file vào mảng 'hinh_anh[]' ---
      // Backend Laravel phải hứng: $request->file('hinh_anh') as $file
      selectedImages.forEach((file) => {
        formData.append('hinh_anh[]', file); 
      });

      const response = await postService.createPost(formData);
      handleClose();
      
      const postData = response.data || response; 
      if (postData) {
          onPostCreated(postData); 
      } else {
          window.location.reload(); 
      }

    } catch (error) {
      console.log("LỖI:", error.response);
      if (error.response && error.response.status === 422) {
          alert("Lỗi dữ liệu đầu vào (Validation).");
      } else {
        alert('Đăng bài thất bại. Vui lòng thử lại!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Tạo bài viết</h3>
          <button className="close-btn" onClick={handleClose}><FaTimes /></button>
        </div>
        <div className="modal-body">
          <div className="user-profile-row">
            <img src={currentUser?.avatar} alt="User" className="avatar-small" />
            <div className="user-name-bold">{currentUser?.name}</div>
          </div>

          <input 
            type="text" className="post-title-input" placeholder="Tiêu đề bài viết..."
            value={tieuDe} onChange={(e) => setTieuDe(e.target.value)} autoFocus
          />
          <textarea 
            placeholder="Bạn đang nghĩ gì thế?" className="post-input-area"
            value={noiDung} onChange={(e) => setNoiDung(e.target.value)}
          />

          {/* HIỂN THỊ DANH SÁCH ẢNH PREVIEW */}
          {previewUrls.length > 0 && (
            <div className="preview-grid-container">
                {previewUrls.map((url, index) => (
                    <div key={index} className="preview-item">
                        <img src={url} alt={`preview-${index}`} />
                        <button className="remove-img-btn" onClick={() => removeImage(index)}>
                            <FaTimes />
                        </button>
                    </div>
                ))}
            </div>
          )}

          <div className="add-to-post">
            <span>Thêm ảnh</span>
            <button className="option-btn" onClick={() => fileInputRef.current.click()}>
               <FaImage color="#45bd62" size={24} />
            </button>
            {/* Thêm thuộc tính multiple */}
            <input 
                type="file" hidden ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                multiple 
            />
          </div>
        </div>
        <div className="modal-footer">
          <button 
            className="submit-post-btn" 
            disabled={(!tieuDe.trim() || !noiDung.trim()) || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Đang đăng...' : 'Đăng'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT PHỤ: GRID HIỂN THỊ ẢNH ---
const ImageGrid = ({ images }) => {
    if (!images || images.length === 0) return null;

    const count = images.length;
    // Lấy URL: Backend có thể trả về string đường dẫn hoặc object { id, duong_dan }
    // Xử lý linh hoạt ở đây:
    const getPath = (img) => typeof img === 'string' ? img : img.duong_dan || img.path;

    // Class CSS để chia layout dựa trên số lượng ảnh
    let gridClass = '';
    if (count === 1) gridClass = 'grid-1';
    else if (count === 2) gridClass = 'grid-2';
    else if (count === 3) gridClass = 'grid-3';
    else if (count >= 4) gridClass = 'grid-4';

    // Chỉ hiển thị tối đa 4 ảnh, ảnh thứ 4 sẽ có overlay số lượng còn lại
    const displayImages = images.slice(0, 4);
    const remaining = count - 4;

    return (
        <div className={`post-image-grid ${gridClass}`}>
            {displayImages.map((img, index) => (
                <div key={index} className={`grid-item item-${index}`}>
                    <img src={getImageUrl(getPath(img))} alt={`img-${index}`} loading="lazy" />
                    {index === 3 && remaining > 0 && (
                        <div className="more-overlay">+{remaining}</div>
                    )}
                </div>
            ))}
        </div>
    );
};

// --- COMPONENT 2: POST CARD ---
const PostCard = ({ post }) => {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false); 
    const [likes, setLikes] = useState(post.likes_count || 0);
  
    const handleDetailClick = () => navigate(`/post/${post.id}`);
  
    const handleLike = async (e) => {
      e.stopPropagation();
      setIsLiked(!isLiked);
      setLikes(prev => !isLiked ? prev + 1 : prev - 1);
      try {
        await postService.likePost(post.id);
      } catch (error) {
        setIsLiked(isLiked); 
      }
    };
  
    const displayDate = post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : 'Vừa xong';

    // --- LOGIC GỘP ẢNH ---
    // Kiểm tra xem bài viết có mảng ảnh (hinh_anh) không, nếu không thì check ảnh đại diện lẻ
    let postImages = [];
    if (post.hinh_anh && Array.isArray(post.hinh_anh) && post.hinh_anh.length > 0) {
        postImages = post.hinh_anh;
    } else if (post.hinh_anh_dai_dien) {
        postImages = [post.hinh_anh_dai_dien];
    }

    return (
      <div className="post-card">
        <div className="post-header">
          <div className="user-info-wrapper" style={{display:'flex', alignItems:'center'}}>
              <img 
                src={post.user?.avatar || 'https://via.placeholder.com/40'} 
                alt={post.user?.name} className="avatar" 
              />
              <div className="user-info">
                <span className="username">{post.user?.name || "Người dùng"}</span>
                <span className="post-date">{displayDate}</span>
              </div>
          </div>
        </div>

        <div className="post-content-area" onClick={handleDetailClick}>
          {post.tieu_de && <h3 className="post-title">{post.tieu_de}</h3>}
          <p className="post-caption-text">{post.noi_dung}</p>
        </div>
        
        {/* THAY THẾ IMAGE CONTAINER CŨ BẰNG IMAGE GRID */}
        <div className="post-media-container" onClick={handleDetailClick}>
             <ImageGrid images={postImages} />
        </div>

        <div className="post-actions">
          <button className={`action-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
            {isLiked ? <FaHeart /> : <FaRegHeart />} <span>{likes}</span>
          </button>
          <button className="action-btn" onClick={handleDetailClick}>
            <FaComment /> <span>{post.comments_count || 0}</span>
          </button>
          <button className="action-btn"><FaShare /></button>
        </div>
      </div>
    );
};

// ... (Phần Home Component giữ nguyên không thay đổi)
const Home = () => {
    // ... Giữ nguyên code cũ của Home ...
    // ... Chỉ cần copy lại đoạn Home cũ vào đây ...
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({ name: 'Bạn', avatar: 'https://via.placeholder.com/40' });

    const CreatePostBox = ({ onClick }) => (
        <div className="create-post-box">
          <div className="cp-top">
            <img src={currentUser?.avatar} alt="avt" className="avatar" />
            <div className="cp-input-trigger" onClick={onClick}>
              {currentUser?.name} ơi, viết gì đi...
            </div>
          </div>
          <div className="cp-bottom">
            <button className="cp-action-btn" onClick={onClick}>
               <FaImage color="#45bd62" /><span>Ảnh</span>
            </button>
          </div>
        </div>
    );

    useEffect(() => {
        const userStored = localStorage.getItem('USER_INFO');
        if(userStored) { try { setCurrentUser(JSON.parse(userStored)); } catch(e){} }
        
        const fetchFeed = async () => {
            try {
                setLoading(true);
                const dataArray = await postService.getFeed();
                setPosts(Array.isArray(dataArray) ? dataArray : []);
            } catch (error) {
                setPosts([]); 
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, []);

    const handlePostCreated = (newPostRaw) => {
        const newPostForUI = {
            ...newPostRaw,
            user: newPostRaw.user || currentUser, 
            likes_count: 0,
            comments_count: 0,
            created_at: new Date().toISOString()
        };
        setPosts([newPostForUI, ...posts]);
    };

    return (
        <div className="feed-container">
            <CreatePostBox onClick={() => setIsModalOpen(true)} />
            <div className="feed-list">
                {loading ? <div className="feed-message">Đang tải...</div> : 
                    (posts.length > 0 ? posts.map(post => <PostCard key={post.id} post={post} />) : <div className="feed-message">Chưa có bài viết.</div>)
                }
            </div>
            <CreatePostModal 
                isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
                onPostCreated={handlePostCreated} currentUser={currentUser}
            />
        </div>
    );
};

export default Home;