import React, { useState, useEffect } from 'react';
import { postService } from '../services/postService';
import { useNavigate, useLocation } from 'react-router-dom';
import './CSS/Home.css';

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  // Khớp với ma_bai_viet từ DB của bạn
  const handleDetailClick = () => navigate(`/post/${post.ma_bai_viet || post.id}`);

  return (
    <div className="post-card">
      <div className="post-header">
        <img src={post.nguoi_tao?.anh_dai_dien || post.user?.avatar} className="avatar" alt="avt" />
        <div className="user-info">
          <span className="username">{post.nguoi_tao?.ho_ten || post.user?.name}</span>
          <span className="post-date">{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
        </div>
      </div>
      <div className="post-caption" onClick={handleDetailClick}>
        <strong style={{ marginRight: '5px' }}>{post.tieu_de}</strong>
        <span>{post.noi_dung}</span>
      </div>
      {post.hinh_anh && (
        <img src={post.hinh_anh} className="post-image" alt="Món ăn" onClick={handleDetailClick} />
      )}
      <div className="post-actions">
        <span className="action-btn">❤️ {post.luot_thich_count || 0}</span>
        <span className="action-btn">💬 {post.binh_luan_count || 0}</span>
      </div>
    </div>
  );
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchKeyword = queryParams.get('search');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let result;
        if (searchKeyword) {
          // Gọi API UC-24 searchPost
          const response = await postService.searchPosts(searchKeyword);
          // Laravel paginate trả về object, danh sách nằm trong .data
          result = response.data?.data || response;
        } else {
          result = await postService.getFeed();
        }
        setPosts(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchKeyword]);

  if (loading) return <div className="feed"><div className="feed-message loading-spinner">Đang tải...</div></div>;

  return (
    <div className="feed">
      {searchKeyword && (
        <div style={{ padding: '15px', background: '#f8f9fa', marginBottom: '10px', borderRadius: '8px' }}>
          Kết quả tìm kiếm cho: <strong>"{searchKeyword}"</strong>
        </div>
      )}

      {posts.map(post => (
        <PostCard key={post.ma_bai_viet || post.id} post={post} />
      ))}

      {!loading && posts.length === 0 && (
        <div className="feed-message">Không tìm thấy bài viết nào khớp với từ khóa.</div>
      )}
    </div>
  );
};

export default Home;