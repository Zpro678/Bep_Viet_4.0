import React, { useState, useEffect, useRef } from 'react';
import { postService } from '../services/postService';
import { useNavigate } from 'react-router-dom';
import { FaRegHeart, FaComment, FaShare, FaImage, FaTimes } from 'react-icons/fa'; // Đã xóa FaHeart
import './CSS/Home.css'; 

const API_BASE_URL = 'http://localhost:8000'; 

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path; 
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

// ... (Giữ nguyên component ImageGrid) ...
const ImageGrid = ({ images }) => {
    if (!images || images.length === 0) return null;
    const count = images.length;
    const getPath = (img) => (typeof img === 'string' ? img : img.duong_dan || img.path || '');
    let gridClass = 'grid-1';
    if (count === 2) gridClass = 'grid-2';
    else if (count === 3) gridClass = 'grid-3';
    else if (count >= 4) gridClass = 'grid-4';
    const displayImages = images.slice(0, 4);
    const remaining = count - 4;
    return (
        <div className={`post-image-grid ${gridClass}`}>
            {displayImages.map((img, index) => (
                <div key={index} className={`grid-item item-${index}`}>
                    <img src={getImageUrl(getPath(img))} alt={`img-${index}`} loading="lazy" />
                    {index === 3 && remaining > 0 && <div className="more-overlay">+{remaining}</div>}
                </div>
            ))}
        </div>
    );
};

// ... (Giữ nguyên component CreatePostModal) ...
const CreatePostModal = ({ isOpen, onClose, onPostCreated, currentUser }) => {
    const [tieuDe, setTieuDe] = useState(''); 
    const [noiDung, setNoiDung] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        return () => { previewUrls.forEach(url => URL.revokeObjectURL(url)); };
    }, [previewUrls]); 

    const handleClose = () => {
        setTieuDe(''); setNoiDung(''); setSelectedImages([]); setPreviewUrls([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onClose();
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const validFiles = files.filter(file => file.type.startsWith('image/'));
            setSelectedImages(prev => [...prev, ...validFiles]);
            const newUrls = validFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newUrls]);
        }
    };

    const removeImage = (index) => {
        const newImages = [...selectedImages]; newImages.splice(index, 1); setSelectedImages(newImages);
        const newUrls = [...previewUrls]; URL.revokeObjectURL(newUrls[index]); newUrls.splice(index, 1); setPreviewUrls(newUrls);
    };

    const handleSubmit = async () => {
        if (!tieuDe.trim() || !noiDung.trim()) return;
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('tieu_de', tieuDe); 
            formData.append('noi_dung', noiDung);
            selectedImages.forEach((file) => { formData.append('hinh_anh[]', file); });

            const response = await postService.createPost(formData);
            handleClose();
            const postData = response.data || response; 
            if (postData) { onPostCreated(postData); } else { window.location.reload(); }
        } catch (error) {
            console.error("Lỗi đăng bài:", error);
            alert('Đăng bài thất bại.');
        } finally { setIsSubmitting(false); }
    };

    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Tạo bài viết</h3> <button className="close-btn" onClick={handleClose}><FaTimes /></button>
                </div>
                <div className="modal-body">
                    <div className="user-profile-row">
                        <img src={currentUser?.avatar} alt="User" className="avatar-small" />
                        <div className="user-name-bold">{currentUser?.name}</div>
                    </div>
                    <input type="text" className="post-title-input" placeholder="Tiêu đề..." value={tieuDe} onChange={(e) => setTieuDe(e.target.value)} autoFocus />
                    <textarea placeholder="Bạn đang nghĩ gì?" className="post-input-area" value={noiDung} onChange={(e) => setNoiDung(e.target.value)} />
                    {previewUrls.length > 0 && (
                        <div className="preview-grid-container">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="preview-item">
                                    <img src={url} alt="preview" />
                                    <button className="remove-img-btn" onClick={() => removeImage(index)}><FaTimes /></button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="add-to-post">
                        <span>Thêm ảnh</span>
                        <button className="option-btn" onClick={() => fileInputRef.current.click()}><FaImage color="#45bd62" size={24} /></button>
                        <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} accept="image/*" multiple />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="submit-post-btn" disabled={(!tieuDe.trim() || !noiDung.trim()) || isSubmitting} onClick={handleSubmit}>
                        {isSubmitting ? 'Đang đăng...' : 'Đăng'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==================================================================
// 3. COMPONENT POST CARD
// ==================================================================
const PostCard = ({ post }) => {
    const navigate = useNavigate();
    
    // Tạm thời comment phần Like xử lý sau
    // const [isLiked, setIsLiked] = useState(false); 
    // const [likes, setLikes] = useState(0);
  
    const handleDetailClick = () => navigate(`/post/${post.ma_bai_viet || post.id}`);
  
    // const handleLike = async (e) => { ... };
  
    const displayDate = post.ngay_dang ? new Date(post.ngay_dang).toLocaleDateString('vi-VN') : 'Vừa xong';
    
    // Xử lý thông tin user (để tránh lỗi undefined)
    const userAvatar = post.nguoi_dung?.anh_dai_dien || post.user?.avatar || 'https://via.placeholder.com/40';
    const userName = post.nguoi_dung?.ho_ten || post.user?.name || "Người dùng";

    let postImages = [];
    if (post.hinh_anh && Array.isArray(post.hinh_anh) && post.hinh_anh.length > 0) {
        postImages = post.hinh_anh;
    } else if (post.hinh_anh_dai_dien) {
        postImages = [post.hinh_anh_dai_dien];
    }

    return (
      <div className="post-card">
        <div className="post-header">
          <div className="user-info-wrapper">
              <img src={userAvatar} alt="user" className="avatar" />
              <div className="user-info">
                <span className="username">{userName}</span>
                <span className="post-date">{displayDate}</span>
              </div>
          </div>
        </div>

        <div className="post-content-area" onClick={handleDetailClick}>
          {post.tieu_de && <h3 className="post-title">{post.tieu_de}</h3>}
          <p className="post-caption-text">{post.noi_dung}</p>
        </div>
        
        <div className="post-media-container" onClick={handleDetailClick}>
             <ImageGrid images={postImages} />
        </div>

        <div className="post-actions">
          {/* Tạm thời chỉ hiển thị icon Like tĩnh */}
          <button className="action-btn">
             <FaRegHeart /> <span>0</span>
          </button>

          {/* HIỂN THỊ SỐ LƯỢNG BÌNH LUẬN */}
          <button className="action-btn" onClick={handleDetailClick}>
            <FaComment /> 
            {/* Laravel trả về 'binh_luan_count' khi dùng withCount('binhLuan') */}
            <span>{post.binh_luan_count || 0}</span>
          </button>
          
          <button className="action-btn"><FaShare /></button>
        </div>
      </div>
    );
};

// ... (Giữ nguyên phần Home component phía dưới) ...
const Home = () => {
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
                const response = await postService.getFeed();
                console.log("Dữ liệu API trả về:", response); 

                let finalData = [];
                if (Array.isArray(response)) { finalData = response; } 
                else if (response && Array.isArray(response.data)) { finalData = response.data; }
                else if (response && response.data && Array.isArray(response.data.data)) { finalData = response.data.data; }

                setPosts(finalData);
            } catch (error) {
                console.error("Lỗi tải trang chủ:", error);
                setPosts([]); 
            } finally { setLoading(false); }
        };
        fetchFeed();
    }, []);

    const handlePostCreated = (newPostRaw) => {
        const newPostForUI = {
            ...newPostRaw,
            user: newPostRaw.user || currentUser, 
            binh_luan_count: 0, // Mặc định bài mới là 0 comment
            created_at: new Date().toISOString()
        };
        setPosts([newPostForUI, ...posts]);
    };

    return (
        <div className="feed-container">
            <CreatePostBox onClick={() => setIsModalOpen(true)} />
            <div className="feed-list">
                {loading ? ( <div className="feed-message">Đang tải bảng tin...</div> ) : (
                    posts.length > 0 ? ( posts.map(post => <PostCard key={post.ma_bai_viet || post.id} post={post} />) ) : (
                        <div className="feed-message">Chưa có bài viết nào.</div>
                    )
                )}
            </div>
            <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPostCreated={handlePostCreated} currentUser={currentUser} />
        </div>
    );
};

export default Home;