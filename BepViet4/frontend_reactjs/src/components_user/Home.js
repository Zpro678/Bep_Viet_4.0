import React, { useState, useEffect } from 'react';
import { postService } from '../services/postService';
import { useNavigate } from 'react-router-dom';
import './CSS/Home.css';

// --- COMPONENT CON: POST CARD ---
const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes_count);

  const handleDetailClick = () => {
    navigate(`/recipe/${post.id}`);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    
    const newStatus = !isLiked;
    setIsLiked(newStatus);
    setLikes(prev => newStatus ? prev + 1 : prev - 1);

    try {
      await postService.likePost(post.id);
    } catch (error) {
      setIsLiked(!newStatus);
      setLikes(prev => newStatus ? prev - 1 : prev + 1);
    }
  };

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-header">
        <img 
          src={post.user.avatar} 
          alt={post.user.name} 
          className="avatar" 
        />
        <div className="user-info">
          <span className="username">{post.user.name}</span>
          <span className="post-date">{post.created_at}</span>
        </div>
      </div>

      {/* Caption */}
      <div className="post-caption" onClick={handleDetailClick}>
        <strong>{post.user.name}</strong>
        {post.content}
      </div>

      {/* Image */}
      <img 
        src={post.image} 
        alt="Món ăn" 
        className="post-image" 
        loading="lazy" 
        onClick={handleDetailClick}
      />

      {/* Actions */}
      <div className="post-actions">
        {/* Nút Like: Dùng template literal để thêm class 'liked' nếu isLiked = true */}
        <span 
          className={`action-btn ${isLiked ? 'liked' : ''}`} 
          onClick={handleLike}
        >
          {isLiked ? '❤️' : '🤍'} {likes}
        </span>
        
        <span className="action-btn" onClick={handleDetailClick}>
          💬 {post.comments_count}
        </span>
        
        <span className="action-btn">
          ✈️
        </span>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH: HOME ---
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const data = await postService.getFeed();
        setPosts(data);
      } catch (error) {
        console.error("Lỗi tải bảng tin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return (
       <div className="feed">
          <div className="feed-message loading-spinner">Đang tải bảng tin...</div>
       </div>
    );
  }

  return (
    <div className="feed">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}

      {posts.length === 0 && (
        <div className="feed-message">
          Chưa có bài đăng nào. Hãy theo dõi thêm mọi người nhé!
        </div>
      )}
    </div>
  );
};

export default Home;