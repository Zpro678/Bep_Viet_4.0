import React, { useState, useEffect, useRef } from 'react';
import postService from '../services/postService';
import { useNavigate } from 'react-router-dom';
import {
    FaRegHeart, FaHeart, FaComment, FaShare,
    FaImage, FaTimes, FaEllipsisH, FaTrash, FaEdit
} from 'react-icons/fa';
import './CSS/Home.css';

const API_BASE_URL = 'http://localhost:8000';

// --- CÁC HÀM HỖ TRỢ (HELPER FUNCTIONS) ---
const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('blob:')) return path;
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

// --- COMPONENT: USER AVATAR ---
const UserAvatar = ({ src, name, className }) => {
    const hasImage = src && src !== 'null' && src !== 'undefined';
    return hasImage ? (
        <img src={getImageUrl(src)} alt={name} className={className} loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />
    ) : (
        <div className={`user-avatar-placeholder ${className}`} style={{ backgroundColor: stringToColor(name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
            {getInitials(name)}
        </div>
    );
};

const ImageGrid = ({ images }) => {
    if (!images || images.length === 0) return null;
    let safeImages = Array.isArray(images) ? images : [];
    const count = safeImages.length;
    const getPath = (img) => (typeof img === 'string' ? img : img.duong_dan || img.path || '');

    let gridClass = count === 2 ? 'grid-2' : count === 3 ? 'grid-3' : count >= 4 ? 'grid-4' : 'grid-1';
    const displayImages = safeImages.slice(0, 4);
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


// --- COMPONENT: CREATE POST MODAL ---

const CreatePostModal = ({ isOpen, onClose, onPostCreated, currentUser }) => {
    const [tieuDe, setTieuDe] = useState('');
    const [noiDung, setNoiDung] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleClose = () => {
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setTieuDe('');
        setNoiDung('');
        setSelectedImages([]);
        setPreviewUrls([]);
        onClose();
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => file.type.startsWith('image/'));
        const newUrls = validFiles.map(file => URL.createObjectURL(file));
        setSelectedImages(prev => [...prev, ...validFiles]);
        setPreviewUrls(prev => [...prev, ...newUrls]);
    };

    const removeImage = (index) => {
        const newFiles = [...selectedImages];
        newFiles.splice(index, 1);
        setSelectedImages(newFiles);
        URL.revokeObjectURL(previewUrls[index]);
        const newUrls = [...previewUrls];
        newUrls.splice(index, 1);
        setPreviewUrls(newUrls);
    };

    const handleSubmit = async () => {
        if (!tieuDe && !noiDung && selectedImages.length === 0) return;
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('tieu_de', tieuDe);
            formData.append('noi_dung', noiDung);
            selectedImages.forEach(file => formData.append('hinh_anh[]', file));

            const response = await postService.createPost(formData);
            onPostCreated(response.data || response);
            handleClose();
        } catch (error) {
            alert('Thêm bài viết thất bại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Tạo bài viết</h3>
                    <button className="close-btn" onClick={handleClose}><FaTimes /></button>
                </div>
                <div className="modal-body">
                    <input type="text" className="post-title-input" placeholder="Tiêu đề bài viết..." value={tieuDe} onChange={e => setTieuDe(e.target.value)} />
                    <textarea className="post-input-area" placeholder={`${currentUser.name} ơi, bạn đang nghĩ gì thế?`} value={noiDung} onChange={e => setNoiDung(e.target.value)} />

                    {previewUrls.length > 0 && (
                        <div className="edit-preview-container" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                            {previewUrls.map((url, index) => (
                                <div key={index} style={{ position: 'relative', width: '60px', height: '60px' }}>
                                    <img src={url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                    <button onClick={() => removeImage(index)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px' }}><FaTimes size={8} /></button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="add-to-post">
                        <span>Thêm vào bài viết của bạn</span>
                        <button className="option-btn" onClick={() => fileInputRef.current.click()}><FaImage color="#45bd62" size={24} /></button>
                        <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} multiple accept="image/*" />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="submit-post-btn" disabled={isSubmitting} onClick={handleSubmit}>
                        {isSubmitting ? 'Đang đăng...' : 'Đăng'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT: MODAL CHỈNH SỬA BÀI VIẾT (ĐÃ CẬP NHẬT) ---
const EditPostModal = ({ isOpen, onClose, onPostUpdated, post }) => {
    const [tieuDe, setTieuDe] = useState('');
    const [noiDung, setNoiDung] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen && post) {
            setTieuDe(post.tieu_de || '');
            setNoiDung(post.noi_dung || '');
            setPreviewUrls([]);
            setSelectedImages([]);
        }
    }, [isOpen, post]);

    const handleClose = () => {
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        onClose();
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => file.type.startsWith('image/'));
        const newUrls = validFiles.map(file => URL.createObjectURL(file));
        setSelectedImages(prev => [...prev, ...validFiles]);
        setPreviewUrls(prev => [...prev, ...newUrls]);
    };

    const removeImage = (index) => {
        const newFiles = [...selectedImages];
        newFiles.splice(index, 1);
        setSelectedImages(newFiles);
        URL.revokeObjectURL(previewUrls[index]);
        const newUrls = [...previewUrls];
        newUrls.splice(index, 1);
        setPreviewUrls(newUrls);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('tieu_de', tieuDe);
            formData.append('noi_dung', noiDung);
            selectedImages.forEach(file => formData.append('hinh_anh[]', file));

            const response = await postService.updatePost(post.ma_bai_viet || post.id, formData);
            onPostUpdated(response.data || response);
            handleClose();
        } catch (error) {
            alert('Cập nhật thất bại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Chỉnh sửa bài viết</h3>
                    <button className="close-btn" onClick={handleClose}><FaTimes /></button>
                </div>
                <div className="modal-body">
                    <input type="text" className="post-title-input" value={tieuDe} onChange={e => setTieuDe(e.target.value)} />
                    <textarea className="post-input-area" value={noiDung} onChange={e => setNoiDung(e.target.value)} />

                    {previewUrls.length > 0 && (
                        <div className="edit-preview-container" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                            {previewUrls.map((url, index) => (
                                <div key={index} style={{ position: 'relative', width: '60px', height: '60px' }}>
                                    <img src={url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                    <button onClick={() => removeImage(index)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px' }}><FaTimes size={8} /></button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="add-to-post">
                        <span>Thay thế/Thêm ảnh mới</span>
                        <button className="option-btn" onClick={() => fileInputRef.current.click()}><FaImage color="#45bd62" size={24} /></button>
                        <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} multiple accept="image/*" />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="submit-post-btn" disabled={isSubmitting} onClick={handleSubmit}>
                        {isSubmitting ? '...' : 'Cập nhật'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT: POST CARD (THẺ BÀI VIẾT) ---
const PostCard = ({ post, currentUser, onDeletePost, onUpdatePost }) => {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const postId = post.ma_bai_viet || post.id;
    const postAuthorId = post.ma_nguoi_dung || post.user_id || post.nguoi_dung?.ma_nguoi_dung || post.user?.id;
    const isOwner = currentUser?.id && String(currentUser.id) === String(postAuthorId);

    useEffect(() => {
        const fetchLike = async () => {
            try {
                const data = await postService.getPostLikeInfo(postId);
                if (data) { setLikeCount(Number(data.total_likes)); setIsLiked(!!data.has_liked); }
            } catch (e) { }
        };
        fetchLike();
    }, [postId]);

    const handleToggleLike = async (e) => {
        e.stopPropagation();
        try {
            const res = await postService.toggleLikePost(postId);
            if (res) { setIsLiked(!!res.has_liked); setLikeCount(Number(res.total_likes)); }
        } catch (e) { }
    };

    // tới trang public profile của user theo id
    const goToProfile = (e) => {
        e.stopPropagation(); // ngăn sự kiện click lan ra ngoài
        navigate(`/user/${postAuthorId}`);
    };

    return (
        <div className="post-card">
            <div className="post-header">
                <div className="user-info-wrapper"
                    style={{ cursor: 'pointer', fontWeight: 'bold' }}
                    onClick={goToProfile} // sang profile
                >
                    <UserAvatar src={post.nguoi_dung?.anh_dai_dien || post.user?.avatar}
                        name={post.nguoi_dung?.ho_ten || post.user?.name}
                        className="avatar"
                    />
                    <div className="user-info">
                        <span className="username"
                            style={{ cursor: 'pointer', fontWeight: 'bold' }}
                            onClick={goToProfile} // sang profile
                        >{post.nguoi_dung?.ho_ten || post.user?.name}</span>
                        <span className="post-date">{post.ngay_dang ? new Date(post.ngay_dang).toLocaleString('vi-VN') : 'Vừa xong'}</span>
                    </div>
                </div>
                {isOwner && (
                    <div className="post-options">
                        <button className="options-btn" onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}>
                            <FaEllipsisH color="#65676b" />
                        </button>
                        {showMenu && (
                            <div className="options-dropdown">
                                <button className="dropdown-item" onClick={() => { setShowMenu(false); setIsEditModalOpen(true); }}>
                                    <FaEdit /> Chỉnh sửa
                                </button>
                                <button className="dropdown-item delete-text" onClick={() => onDeletePost(postId)}>
                                    <FaTrash /> Xóa
                                </button>
                            </div>
                        )}
                        {showMenu && <div onClick={() => setShowMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />}
                    </div>
                )}
            </div>
            <div className="post-content-area" onClick={() => navigate(`/post/${postId}`)}>
                {post.tieu_de && <h3 className="post-title">{post.tieu_de}</h3>}
                <p className="post-caption-text">{post.noi_dung}</p>
            </div>
            <div className="post-media-container" onClick={() => navigate(`/post/${postId}`)}>
                <ImageGrid images={post.hinh_anh || []} />
            </div>
            <div className="post-actions">
                <button className={`action-btn ${isLiked ? 'liked-active' : ''}`} onClick={handleToggleLike}>
                    {isLiked ? <FaHeart color="red" /> : <FaRegHeart />} <span>{likeCount || 'Thích'}</span>
                </button>
                <button className="action-btn" onClick={() => navigate(`/post/${postId}`)}><FaComment /> <span>{post.binh_luan_count || 'Bình luận'}</span></button>
                <button className="action-btn"><FaShare /> <span>Chia sẻ</span></button>
            </div>
            <EditPostModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} post={post} onPostUpdated={onUpdatePost} />
        </div>
    );
};

// --- TRANG CHỦ (MAIN COMPONENT) ---
const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [currentUser] = useState(() => {
        const userStored = localStorage.getItem('USER');
        if (!userStored) return { name: 'Khách', id: null };
        try {
            const parsed = JSON.parse(userStored);
            const user = parsed.data || parsed.user || parsed;
            return { id: user.ma_nguoi_dung || user.id, name: user.ho_ten || user.name, avatar: user.anh_dai_dien || user.avatar };
        } catch (e) { return { name: 'Khách', id: null }; }
    });

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await postService.getFeed();
                setPosts(Array.isArray(res) ? res : res.data || []);
            } catch (e) { setPosts([]); } finally { setLoading(false); }
        };
        fetchFeed();
    }, []);

    const handlePostCreated = (newPost) => {
        setPosts(prev => [newPost, ...prev]);
    };

    const handlePostDeleted = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
            try {
                await postService.deletePost(id);
                setPosts(prev => prev.filter(p => (p.ma_bai_viet || p.id) !== id));
            } catch (e) { alert("Không thể xóa bài viết."); }
        }
    };

    const handlePostUpdated = (updated) => {
        setPosts(prev => prev.map(p => (p.ma_bai_viet || p.id) === (updated.ma_bai_viet || updated.id) ? { ...p, ...updated } : p));
    };

    return (
        <div className="feed-container">
            <div className="create-post-box">
                <div className="cp-top">
                    <UserAvatar src={currentUser.avatar} name={currentUser.name} className="avatar" />
                    <div className="cp-input-trigger" onClick={() => setIsCreateModalOpen(true)}>
                        {currentUser.name} ơi, bạn đang nghĩ gì thế?
                    </div>
                </div>
            </div>

            <div className="feed-list">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</div>
                ) : posts.length > 0 ? (
                    posts.map(post => (
                        <PostCard
                            key={post.ma_bai_viet || post.id}
                            post={post}
                            currentUser={currentUser}
                            onDeletePost={handlePostDeleted}
                            onUpdatePost={handlePostUpdated}
                        />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', color: '#65676b' }}>Chưa có bài viết nào.</div>
                )}
            </div>

            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onPostCreated={handlePostCreated}
                currentUser={currentUser}
            />
        </div>
    );
};

export default Home;