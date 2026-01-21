import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';

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
    } catch {
      setIsLiked(!newStatus);
      setLikes(prev => newStatus ? prev - 1 : prev + 1);
    }
  };

  if (!post || !post.user) return null;

  return (
    <div className="post-card">
      <div className="post-header">
        <img
          src={post.user.avatar}
          alt=""
          className="avatar"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/user/${post.user.id}`);
          }}
        />
        <div className="user-info">
          <span>{post.user.name}</span>
          <span>{post.created_at}</span>
        </div>
      </div>

      <div className="post-caption" onClick={handleDetailClick}>
        {post.content}
      </div>

      <img src={post.image} className="post-image" onClick={handleDetailClick} />

      <div className="post-actions">
        <span onClick={handleLike}>
          {isLiked ? '❤️' : '🤍'} {likes}
        </span>
        <span onClick={handleDetailClick}>
          💬 {post.comments_count}
        </span>
      </div>
    </div>
  );
};

export default PostCard;
