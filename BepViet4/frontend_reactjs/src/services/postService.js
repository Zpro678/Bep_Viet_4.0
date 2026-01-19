// src/services/postService.js

// Mô phỏng dữ liệu trả về từ Laravel (Eloquent Relationship: Post belongsTo User)
const MOCK_POSTS = [
  {
    id: 1,
    content: "Salad rau củ tươi mát! 🥗",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes_count: 120,
    comments_count: 45,
    created_at: "2 giờ trước",
    user: {
      id: 101,
      name: "Bếp Trưởng Gordon",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 2,
    content: "Bữa sáng hoàn hảo cho ngày mới năng động 🥑🍳",
    image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes_count: 85,
    comments_count: 12,
    created_at: "5 giờ trước",
    user: {
      id: 102,
      name: "Sarah Baker",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  }
];

export const postService = {
  getFeed: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_POSTS);
      }, 500); // Giả lập độ trễ mạng
    });
  },

  likePost: async (postId) => {
    console.log(`Đã like bài viết ${postId} trên server Laravel`);
    return Promise.resolve(true);
  }
};