import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { FaRegHeart, FaHeart, FaRegComment, FaShare, FaArrowLeft, FaPaperPlane } from 'react-icons/fa';

// Import CSS
import './CSS/PostDetail.css'; 

const API_BASE_URL = 'http://localhost:8000'; 

// Hàm này vẫn giữ để dùng cho ảnh bài viết
const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path; 
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

// ==========================================================
// 1. CÁC HÀM HỖ TRỢ VÀ COMPONENT AVATAR
// ==========================================================

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

const UserAvatar = ({ src, name, className }) => {
    const hasImage = src && src !== 'null' && src !== 'undefined' && !src.includes('placeholder.com');
    const finalSrc = hasImage ? (src.startsWith('http') ? src : getImageUrl(src)) : null;

    if (finalSrc) {
        return (
            <img 
                src={finalSrc} 
                alt={name} 
                className={className} 
                loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; }} 
            />
        );
    }

    return (
        <div 
            className={`user-avatar-placeholder ${className}`}
            style={{ 
                backgroundColor: stringToColor(name),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: className?.includes('small') ? '12px' : '16px'
            }}
        >
            {getInitials(name)}
        </div>
    );
};

// ==========================================================
// 2. COMPONENT CON: COMMENT ITEM
// ==========================================================
const CommentItem = ({ comment, currentUserId, onDelete }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [editContent, setEditContent] = useState(comment.noi_dung);
    const [displayContent, setDisplayContent] = useState(comment.noi_dung);
    
    const [replies, setReplies] = useState([]);
    const [showReplies, setShowReplies] = useState(false);
    const [repliesLoaded, setRepliesLoaded] = useState(false);

    const author = comment.nguoi_dung || {};
    const authorName = author.ho_ten || "Người dùng";
    const authorAvatarRaw = author.anh_dai_dien; 
    
    // --- ĐÃ SỬA LỖI 1: Dùng String() và === để so sánh chính xác ---
    const isOwner = currentUserId && String(author.ma_nguoi_dung) === String(currentUserId);

    const handleLoadReplies = async () => {
        if (!repliesLoaded) {
            const data = await postService.getReplies(comment.ma_binh_luan);
            setReplies(data);
            setRepliesLoaded(true);
        }
        setShowReplies(!showReplies);
    };

    const handleSubmitReply = async () => {
        if (!replyContent.trim()) return;
        try {
            const res = await postService.replyComment(comment.ma_binh_luan, replyContent);
            const newReply = res.data || res; 
            setReplies([...replies, newReply]); 
            setReplyContent('');
            setIsReplying(false);
            setShowReplies(true); 
        } catch (error) {
            alert("Lỗi gửi trả lời");
        }
    };

    const handleUpdateComment = async () => {
        if (!editContent.trim()) return;
        try {
            await postService.updateComment(comment.ma_binh_luan, editContent);
            setDisplayContent(editContent);
            setIsEditing(false);
        } catch (error) {
            alert("Lỗi cập nhật bình luận");
        }
    };

    const handleDeleteComment = async () => {
        if (window.confirm("Bạn có chắc muốn xóa bình luận này?")) {
            try {
                await postService.deleteComment(comment.ma_binh_luan);
                onDelete(comment.ma_binh_luan); 
            } catch (error) {
                alert("Lỗi xóa bình luận");
            }
        }
    };

    return (
        <div className="comment-item-container">
            <div className="comment-item">
                <UserAvatar 
                    src={authorAvatarRaw} 
                    name={authorName} 
                    className="comment-avatar" 
                />
                
                <div className="comment-content-group">
                    <div className="comment-bubble">
                        <span className="comment-author-name">{authorName}</span>
                        {isEditing ? (
                            <div className="edit-input-wrapper">
                                <input 
                                    className="edit-comment-input"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    autoFocus
                                />
                                <div className="edit-actions">
                                    <span onClick={() => setIsEditing(false)}>Hủy</span>
                                    <span onClick={handleUpdateComment} style={{color:'#0084ff'}}>Lưu</span>
                                </div>
                            </div>
                        ) : (
                            <span className="comment-text">{displayContent}</span>
                        )}
                    </div>

                    <div className="comment-meta">
                        <span className="action-link" onClick={() => setIsReplying(!isReplying)}>Phản hồi</span>
                        {isOwner && !isEditing && (
                            <>
                                <span className="action-link" onClick={() => setIsEditing(true)}>Sửa</span>
                                <span className="action-link" onClick={handleDeleteComment}>Xóa</span>
                            </>
                        )}
                        <span className="time">{new Date(comment.ngay_gui).toLocaleString('vi-VN')}</span>
                    </div>

                    {isReplying && (
                        <div className="reply-input-area">
                            <input 
                                type="text" 
                                className="reply-input"
                                placeholder={`Trả lời ${authorName}...`}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply()}
                            />
                            <button onClick={handleSubmitReply} className="send-reply-btn"><FaPaperPlane /></button>
                        </div>
                    )}

                    {(comment.tra_loi_count > 0 || replies.length > 0) && (
                        <div className="view-replies-link" onClick={handleLoadReplies}>
                            {showReplies ? "Ẩn câu trả lời" : `Xem ${comment.tra_loi_count || replies.length} câu trả lời`}
                        </div>
                    )}

                    {showReplies && (
                        <div className="replies-list">
                            {replies.map(reply => (
                                <CommentItem 
                                    key={reply.ma_binh_luan} 
                                    comment={reply} 
                                    currentUserId={currentUserId}
                                    onDelete={(id) => setReplies(replies.filter(r => r.ma_binh_luan !== id))}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ==========================================================
// 3. COMPONENT CHÍNH: POST DETAIL
// ==========================================================
const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // --- STATE QUẢN LÝ LIKE ---
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // --- LẤY THÔNG TIN USER HIỆN TẠI ---
  // --- ĐÃ SỬA LỖI 2: Xóa 'setCurrentUser' vì không dùng ---
  const [currentUser] = useState(() => {
    const userStored = localStorage.getItem('USER_INFO');
    if (userStored) {
        try {
            let parsed = JSON.parse(userStored);
            const findUserObject = (obj) => {
                if (!obj) return null;
                if (obj.ho_ten || obj.name) return obj;
                if (obj.data) return findUserObject(obj.data);
                if (obj.user) return findUserObject(obj.user);
                return obj;
            };
            const realUser = findUserObject(parsed);
            return {
                id: realUser?.ma_nguoi_dung || realUser?.id,
                name: realUser?.ho_ten || realUser?.name || 'Bạn',
                avatar: realUser?.anh_dai_dien || realUser?.avatar
            };
        } catch (e) { return { name: 'Bạn', avatar: null }; }
    }
    return { name: 'Bạn', avatar: null };
  });

  const currentUserId = currentUser.id; 

  // ============================================
  // === PHẦN USE EFFECT CÓ LOG DEBUG ===
  // ============================================
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`[DEBUG] Bắt đầu tải bài viết ID: ${id}`);

        // 1. Lấy chi tiết bài
        const data = await postService.getPostDetail(id);
        
        if (data) {
             setPost(data);
             console.log("[DEBUG] Đã tải xong chi tiết bài viết:", data);
        } else {
             throw new Error('Không tìm thấy bài viết');
        }
        
        // 2. Lấy thông tin Like chính xác cho User hiện tại
        console.log(`[DEBUG] Đang gọi API lấy info Like cho bài: ${id}`);
        const likeData = await postService.getPostLikeInfo(id);
        
        console.log("[DEBUG] >>> Dữ liệu Like trả về từ API:", likeData);

        if (likeData) {
            const count = Number(likeData.total_likes) || 0;
            const liked = !!likeData.has_liked;
            
            console.log(`[DEBUG] Update State -> Count: ${count}, Liked: ${liked}`);
            
            setLikeCount(count);
            setIsLiked(liked);
        } else {
            console.warn("[DEBUG] API Like trả về null hoặc undefined");
        }

      } catch (err) {
        console.error("[DEBUG] Lỗi xảy ra trong quá trình fetch:", err);
        setError('Lỗi kết nối hoặc bài viết đã bị xoá.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);
  // ============================================


  // --- XỬ LÝ CLICK LIKE ---
  const handleToggleLike = async () => {
    const previousLiked = isLiked;
    const previousCount = likeCount;

    // UI Update ngay lập tức (Optimistic)
    const newLikedState = !previousLiked;
    setIsLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : (prev > 0 ? prev - 1 : 0));

    try {
        console.log("[DEBUG] User click Like/Unlike...");
        const response = await postService.toggleLikePost(id);
        
        console.log("[DEBUG] Kết quả toggle like:", response);

        if (response) {
             setIsLiked(!!response.has_liked);
             setLikeCount(Number(response.total_likes));
        }
    } catch (error) {
        console.error("[DEBUG] Lỗi khi toggle like:", error);
        // Hoàn tác nếu lỗi
        setIsLiked(previousLiked);
        setLikeCount(previousCount);
        alert("Lỗi khi thực hiện thao tác thích.");
    }
  };

  const handleSendComment = async () => {
    if (!commentContent.trim()) return;
    setIsSubmittingComment(true);
    try {
        const res = await postService.createComment(id, commentContent);
        const newComment = res.data || res; 
        
        if (post) {
            const updatedComments = [newComment, ...(post.binh_luan || [])];
            setPost({
                ...post,
                binh_luan: updatedComments,
                binh_luan_count: (post.binh_luan_count || 0) + 1
            });
        }
        setCommentContent('');
    } catch (err) {
        alert("Gửi bình luận thất bại.");
    } finally {
        setIsSubmittingComment(false);
    }
  };

  const handleRemoveCommentFromList = (deletedCommentId) => {
      if(!post) return;
      const updatedList = post.binh_luan.filter(c => c.ma_binh_luan !== deletedCommentId);
      setPost({
          ...post,
          binh_luan: updatedList,
          binh_luan_count: post.binh_luan_count - 1
      });
  };

  if (loading) return <div className="feed-container loading-text">Đang tải...</div>;
  if (error) return <div className="feed-container error-text">{error}</div>;
  if (!post) return null;

  const postOwnerName = post.nguoi_dung?.ho_ten || "Người dùng";
  const postOwnerAvatar = post.nguoi_dung?.anh_dai_dien;

  return (
    <div className="feed-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        <FaArrowLeft /> Quay lại
      </button>

      <div className="post-card">
        <div className="post-header">
           <div className="user-info-wrapper">
             <UserAvatar 
                src={postOwnerAvatar} 
                name={postOwnerName} 
                className="avatar" 
             />
             <div className="user-info">
               <span className="username">{postOwnerName}</span>
               <span className="post-date">{new Date(post.ngay_dang).toLocaleString()}</span>
             </div>
           </div>
        </div>

        <div className="post-content-area">
            <h3 className="post-title">{post.tieu_de}</h3>
            <p className="post-caption-text">{post.noi_dung}</p>
        </div>

        {post.hinh_anh && post.hinh_anh.length > 0 && (
            <div className="post-media-container">
                {post.hinh_anh.map((img, i) => (
                    <img key={i} src={getImageUrl(img.duong_dan)} alt="img" className="detail-image-item" />
                ))}
            </div>
        )}
        
        <div className="post-actions">
           {/* --- NÚT LIKE --- */}
           <button 
                className={`action-btn ${isLiked ? 'liked-active' : ''}`} 
                onClick={handleToggleLike}
                style={{ color: isLiked ? '#e74c3c' : 'inherit' }}
           >
                {isLiked ? <FaHeart color="#e74c3c" /> : <FaRegHeart />} 
                <span style={{ marginLeft: '6px', fontWeight: '500' }}>
                    {likeCount > 0 ? likeCount : 'Thích'}
                </span>
           </button>

           <button className="action-btn">
               <FaRegComment /> 
               <span style={{ marginLeft: '6px' }}>
                   {post.binh_luan_count > 0 ? post.binh_luan_count : 'Bình luận'}
               </span>
           </button>
           
           <button className="action-btn"><FaShare /> Chia sẻ</button>
        </div>

        {/* --- KHU VỰC BÌNH LUẬN --- */}
        <div className="comment-section">
          <h4 className="comment-header-title">Bình luận</h4>
          
          <div className="comment-input-area">
             <UserAvatar 
                src={currentUser.avatar} 
                name={currentUser.name} 
                className="comment-avatar" 
             />
             <input 
                type="text" 
                className="comment-input-box" 
                placeholder="Viết bình luận công khai..." 
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
             />
             <button className="send-cmt-btn" onClick={handleSendComment} disabled={isSubmittingComment}>
                <FaPaperPlane color={isSubmittingComment ? '#ccc' : '#45bd62'} />
             </button>
          </div>

          <div className="comments-list">
             {(post.binh_luan || []).length > 0 ? (
                post.binh_luan.map((bl) => (
                    <CommentItem 
                        key={bl.ma_binh_luan} 
                        comment={bl} 
                        currentUserId={currentUserId}
                        onDelete={handleRemoveCommentFromList}
                    />
                ))
             ) : (
                <div className="no-comment">Chưa có bình luận nào.</div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;