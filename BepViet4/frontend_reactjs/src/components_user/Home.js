// src/components/Home.js

import React, { useState, useEffect, useRef } from 'react';
import { postService } from '../services/postService'; 
import { useNavigate } from 'react-router-dom';
import { FaRegHeart, FaHeart, FaComment, FaShare, FaImage, FaTimes } from 'react-icons/fa';
import './CSS/Home.css'; // Đảm bảo đường dẫn CSS đúng

const API_BASE_URL = 'http://localhost:8000';

// --- 1. HELPER FUNCTIONS ---
const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
};



const stringToColor = (string) => {
    if (!string) return '#ccc';
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
};

const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
};

// --- 2. COMPONENT: USER AVATAR ---
const UserAvatar = ({ src, name, className }) => {
    const hasImage = src && src !== 'null' && src !== 'undefined';
    
    // Nếu có ảnh -> Render thẻ img với class được truyền vào (avatar hoặc avatar-small)
    if (hasImage) {
        return (
            <img
                src={getImageUrl(src)}
                alt={name}
                className={className} 
                loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; }}
            />
        );
    }

    // Nếu không có ảnh -> Render placeholder
    // CSS class kết hợp: "user-avatar-placeholder" + class kích thước (avatar/avatar-small)
    return (
        <div
            className={`user-avatar-placeholder ${className}`}
            style={{ backgroundColor: stringToColor(name) }}
        >
            {getInitials(name)}
        </div>
    );
};

// --- 3. COMPONENT: IMAGE GRID ---

const ImageGrid = ({ images }) => {
    if (!images || images.length === 0) return null;

    let safeImages = images;
    if (typeof images === 'string') {
        try { safeImages = JSON.parse(images); } catch (e) { safeImages = []; }
    }

    if (!Array.isArray(safeImages) || safeImages.length === 0) return null;

    const count = safeImages.length;
    const getPath = (img) => (typeof img === 'string' ? img : img.duong_dan || img.path || '');
    
    // Logic class khớp với CSS: .grid-1, .grid-2, .grid-3, .grid-4
    let gridClass = 'grid-1';
    if (count === 2) gridClass = 'grid-2';
    else if (count === 3) gridClass = 'grid-3';
    else if (count >= 4) gridClass = 'grid-4';

    const displayImages = safeImages.slice(0, 4);
    const remaining = count - 4;

    return (
        <div className={`post-image-grid ${gridClass}`}>
            {displayImages.map((img, index) => (
                <div key={index} className={`grid-item item-${index}`}>
                    <img src={getImageUrl(getPath(img))} alt={`img-${index}`} loading="lazy" />
                    {/* Overlay hiển thị số ảnh còn lại (+5) */}
                    {index === 3 && remaining > 0 && <div className="more-overlay">+{remaining}</div>}
                </div>
            ))}
        </div>
    );
};


// --- 4. COMPONENT: POST CARD ---
const PostCard = ({ post }) => {
    const navigate = useNavigate();
    
    // State quản lý Like
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const postId = post.ma_bai_viet || post.id;
    
    // Thông tin user
    const userAvatar = post.nguoi_dung?.anh_dai_dien || post.user?.avatar;
    const userName = post.nguoi_dung?.ho_ten || post.user?.name || "Người dùng";
    const displayDate = post.ngay_dang ? new Date(post.ngay_dang).toLocaleDateString('vi-VN') : 'Vừa xong';

    // Xử lý ảnh bài viết
    let postImages = [];
    if (post.hinh_anh) {
        postImages = post.hinh_anh;
    } else if (post.hinh_anh_dai_dien) {
        postImages = [post.hinh_anh_dai_dien];
    }

    // API: Lấy thông tin Like
    useEffect(() => {
        let isMounted = true;
        const fetchLikeInfo = async () => {
            if (!postId) return;
            try {
                const data = await postService.getPostLikeInfo(postId);
                if (data && isMounted) {
                    setLikeCount(Number(data.total_likes) || 0); 
                    setIsLiked(!!data.has_liked); 
                }
            } catch (error) {
                console.error(`Lỗi lấy like bài ${postId}:`, error);
            }
        };
        fetchLikeInfo();
        return () => { isMounted = false; };
    }, [postId]);

    // Handler: Toggle Like
    const handleToggleLike = async (e) => {
        e.stopPropagation();
        
        const previousLiked = isLiked;
        const previousCount = likeCount;

        // Optimistic Update
        const newLikedState = !previousLiked;
        setIsLiked(newLikedState);
        setLikeCount(prev => newLikedState ? prev + 1 : (prev > 0 ? prev - 1 : 0));

        try {
            const response = await postService.toggleLikePost(postId);
            if (response) {
                 setIsLiked(!!response.has_liked);
                 setLikeCount(Number(response.total_likes));
            }
        } catch (error) {
            setIsLiked(previousLiked);
            setLikeCount(previousCount);
        }
    };

    const handleDetailClick = () => navigate(`/post/${postId}`);

    return (
        <div className="post-card">
            {/* Header: Avatar + Tên + Ngày */}
            <div className="post-header">
                <div className="user-info-wrapper">
                    <UserAvatar src={userAvatar} name={userName} className="avatar" />
                    <div className="user-info">
                        <span className="username">{userName}</span>
                        <span className="post-date">{displayDate}</span>
                    </div>
                </div>
            </div>

            {/* Content: Tiêu đề + Nội dung */}
            <div className="post-content-area" onClick={handleDetailClick}>
                {post.tieu_de && <h3 className="post-title">{post.tieu_de}</h3>}
                <p className="post-caption-text">{post.noi_dung}</p>
            </div>
            
            {/* Media: Grid ảnh */}
            <div className="post-media-container" onClick={handleDetailClick}>
                 <ImageGrid images={postImages} />
            </div>

            {/* Footer: Actions (Like, Comment) */}
            <div className="post-actions">
                <button 
                    // Class "liked-active" sẽ kích hoạt màu đỏ và animation trong CSS
                    className={`action-btn ${isLiked ? 'liked-active' : ''}`} 
                    onClick={handleToggleLike}
                >
                    {isLiked ? <FaHeart /> : <FaRegHeart />} 
                    <span>{likeCount > 0 ? likeCount : 'Thích'}</span>
                </button>

                <button className="action-btn" onClick={handleDetailClick}>
                    <FaComment /> 
                    <span>{post.binh_luan_count > 0 ? post.binh_luan_count : 'Bình luận'}</span>
                </button>
                
                <button className="action-btn">
                    <FaShare />
                    <span>Chia sẻ</span>
                </button>
            </div>
        </div>
    );
};

// --- 5. COMPONENT: CREATE POST MODAL ---
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
                    <h3>Tạo bài viết</h3> 
                    <button className="close-btn" onClick={handleClose}><FaTimes /></button>
                </div>
                
                <div className="modal-body">
                    <div className="user-profile-row">
                        <UserAvatar src={currentUser?.avatar} name={currentUser?.name} className="avatar-small" />
                        <div className="user-name-bold">{currentUser?.name}</div>
                    </div>
                    
                    <input 
                        type="text" 
                        className="post-title-input" 
                        placeholder="Tiêu đề..." 
                        value={tieuDe} 
                        onChange={(e) => setTieuDe(e.target.value)} 
                        autoFocus 
                    />
                    
                    <textarea 
                        placeholder="Bạn đang nghĩ gì?" 
                        className="post-input-area" 
                        value={noiDung} 
                        onChange={(e) => setNoiDung(e.target.value)} 
                    />
                    
                    {/* Preview Images Grid */}
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
                        <span>Thêm ảnh vào bài viết</span>
                        <button className="option-btn" onClick={() => fileInputRef.current.click()}>
                            <FaImage color="#45bd62" size={24} />
                        </button>
                        <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} accept="image/*" multiple />
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

// --- 6. COMPONENT: HOME (MAIN) ---
const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [currentUser] = useState(() => {
        const userStored = localStorage.getItem('USER_INFO');
        if (userStored) {
            try {
                let parsed = JSON.parse(userStored);
                // Tìm thông tin user
                const findUserObject = (obj) => {
                    if (!obj) return null;
                    if (obj.ho_ten || obj.name || obj.ten_dang_nhap) return obj;
                    if (obj.data) return findUserObject(obj.data);
                    if (obj.user) return findUserObject(obj.user);
                    return obj;
                };
                const realUser = findUserObject(parsed);
                return {
                    name: realUser?.ho_ten || realUser?.name || realUser?.ten_dang_nhap || 'Bạn',
                    avatar: realUser?.anh_dai_dien || realUser?.avatar || null
                };
            } catch (e) {
                return { name: 'Bạn', avatar: null };
            }
        }
        return { name: 'Bạn', avatar: null };
    });

    // Box kích hoạt Modal
    const CreatePostBox = ({ onClick }) => (
        <div className="create-post-box">
            <div className="cp-top">
                <UserAvatar src={currentUser?.avatar} name={currentUser?.name} className="avatar" />
                <div className="cp-input-trigger" onClick={onClick}>
                    {currentUser?.name} ơi, viết gì đi...
                </div>
            </div>
            <div className="cp-bottom">
                <button className="cp-action-btn" onClick={onClick}>
                   <FaImage color="#45bd62" size={20}/>
                   <span>Ảnh/Video</span>
                </button>
            </div>
        </div>
    );

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                setLoading(true);
                const response = await postService.getFeed();
                
                let finalData = [];
                if (Array.isArray(response)) { finalData = response; }
                else if (response && Array.isArray(response.data)) { finalData = response.data; }
                else if (response && response.data && Array.isArray(response.data.data)) { finalData = response.data.data; }

                setPosts(finalData);
            } catch (error) {
                console.error("Lỗi tải trang chủ:", error);
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
            ma_bai_viet: newPostRaw.ma_bai_viet || newPostRaw.id,
            user: currentUser,
            nguoi_dung: { 
                ho_ten: currentUser.name,
                anh_dai_dien: currentUser.avatar
            },
            binh_luan_count: 0,
            created_at: new Date().toISOString(),
            hinh_anh: newPostRaw.hinh_anh || []
        };
        setPosts([newPostForUI, ...posts]);
    };

    return (
        <div className="feed-container">
            <CreatePostBox onClick={() => setIsModalOpen(true)} />
            
            <div className="feed-list">
                {loading ? (
                    <div className="feed-message">Đang tải bảng tin...</div>
                ) : (
                    posts.length > 0 ? (
                        posts.map(post => (
                            <PostCard key={post.ma_bai_viet || post.id} post={post} />
                        ))
                    ) : (
                        <div className="feed-message">Chưa có bài viết nào.</div>
                    )
                )}
            </div>

            <CreatePostModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onPostCreated={handlePostCreated} 
                currentUser={currentUser} 
            />
        </div>
    );
};

export default Home;