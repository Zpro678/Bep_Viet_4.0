import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { FaRegHeart, FaRegComment, FaShare, FaArrowLeft, FaPaperPlane } from 'react-icons/fa';

// Import CSS
import './CSS/PostDetail.css'; 

// 1. KHAI BÁO URL SERVER (Để nối chuỗi ảnh)
const API_BASE_URL = 'http://localhost:8000'; 

// 2. HÀM XỬ LÝ ĐƯỜNG DẪN ẢNH AN TOÀN
const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path; 
  // Nối domain backend nếu là đường dẫn tương đối từ Laravel
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. LOAD DỮ LIỆU
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        console.log("Đang lấy ID:", id); 

        const res = await postService.getPostDetail(id);
        
        console.log("Dữ liệu nhận được:", res);

        // API trả về trực tiếp object bài viết, nên kiểm tra res là đủ
        if (res) {
            setPost(res); 
        } else {
            setError('Không tìm thấy bài viết');
        }

      } catch (err) {
        console.error(err);
        setError('Lỗi kết nối hoặc bài viết không tồn tại');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  if (loading) return <div className="feed-container" style={{textAlign:'center', marginTop: 50}}>Đang tải...</div>;
  if (error) return <div className="feed-container" style={{textAlign:'center', marginTop: 50}}>{error}</div>;
  if (!post) return null;

  // Helper format ngày
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // 4. RENDER ẢNH BÀI VIẾT (Dọc)
  const renderImages = () => {
    const images = post.hinhAnh || post.hinh_anh || [];
    if (images.length === 0) return null;

    return (
      <div className="post-media-container">
        {images.map((img, index) => (
           <img 
             key={index} 
             // Dùng hàm getImageUrl để hiển thị đúng ảnh từ backend
             src={getImageUrl(img.duong_dan)} 
             alt={`detail-${index}`} 
             className="detail-image-item"
             style={{ maxWidth: '100%', height: 'auto', display: 'block', marginBottom: 10 }} 
           />
        ))}
      </div>
    );
  };

  return (
    <div className="feed-container">
      {/* Nút Back */}
      <button onClick={() => navigate(-1)} className="back-btn">
        <FaArrowLeft /> Quay lại
      </button>

      <div className="post-card">
        {/* Header: User Info */}
        <div className="post-header">
          <div className="user-info-wrapper">
            <img 
              // Xử lý avatar user đăng bài
              src={post.nguoiDung?.anh_dai_dien ? getImageUrl(post.nguoiDung.anh_dai_dien) : "https://via.placeholder.com/40"} 
              alt="avatar" 
              className="avatar" 
            />
            <div className="user-info">
              <span className="username">{post.nguoiDung?.ho_ten || "Người dùng"}</span>
              <span className="post-date">{formatDate(post.ngay_dang)}</span>
            </div>
          </div>
        </div>

        {/* Nội dung Text */}
        <div className="post-content-area">
          <h3 className="post-title">{post.tieu_de}</h3>
          <p className="post-caption-text">{post.noi_dung}</p>
        </div>

        {/* Danh sách ảnh */}
        {renderImages()}

        {/* Thống kê */}
        <div className="post-stats">
             <span>{post.luot_yeu_thich || 0} lượt thích</span>
             <span>{post.binh_luan_count || 0} bình luận</span>
        </div>

        {/* Nút hành động */}
        <div className="post-actions">
          <button className="action-btn">
            <FaRegHeart /> Thích
          </button>
          <button className="action-btn">
            <FaRegComment /> Bình luận
          </button>
          <button className="action-btn">
            <FaShare /> Chia sẻ
          </button>
        </div>

        {/* --- PHẦN BÌNH LUẬN --- */}
        <div className="comment-section">
          <h4 className="comment-header-title">Bình luận</h4>
          
          {/* Kiểm tra mảng binhLuan (camelCase) hoặc binh_luan (snake_case) */}
          {(post.binhLuan || post.binh_luan || []).length > 0 ? (
            (post.binhLuan || post.binh_luan).map((bl) => {
              
              // Lấy thông tin người comment an toàn
              const author = bl.nguoiDung || bl.nguoi_dung || {};
              const authorName = author.ho_ten || "Người dùng ẩn danh";
              const authorAvatar = author.anh_dai_dien 
                                   ? getImageUrl(author.anh_dai_dien) 
                                   : "https://via.placeholder.com/32";

              return (
                <div key={bl.ma_binh_luan} className="comment-item">
                  <img 
                     src={authorAvatar} 
                     alt="user" 
                     className="comment-avatar" 
                  />
                  <div className="comment-content-group">
                    <div className="comment-bubble">
                      <span className="comment-author-name">{authorName}</span>
                      <span className="comment-text">{bl.noi_dung}</span>
                    </div>
                    <div className="comment-meta">
                      <span>Thích</span>
                      <span>Phản hồi</span>
                      <span className="time">{formatDate(bl.ngay_gui).split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-comment">Chưa có bình luận nào. Hãy là người đầu tiên!</div>
          )}

          {/* Input nhập comment */}
          <div className="comment-input-area">
             <img src="https://via.placeholder.com/32" alt="me" className="comment-avatar" />
             <input type="text" className="comment-input-box" placeholder="Viết bình luận..." />
             <button className="send-cmt-btn">
                <FaPaperPlane />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;