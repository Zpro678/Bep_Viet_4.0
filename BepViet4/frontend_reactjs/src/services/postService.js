
import axiosClient from '../api/axiosClient';

const postService = {
  getFeed: async (params = {}) => {
    try {
      const response = await axiosClient.get('/posts', { params });
      if (response && response.data && Array.isArray(response.data)) {
         return response.data; 
      }
      return response.data || [];
    } catch (error) {
      console.error("Lỗi lấy bài viết:", error);
      return [];
    }
  },

 
  createPost: async (formData) => {
    try {
      const response = await axiosClient.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data || response; 
    } catch (error) {
      console.error("Lỗi tạo bài viết:", error);
      throw error;
    }
  },

  // Lấy chi tiết bài viết
  getPostDetail: async (id) => {
    try {
      const response = await axiosClient.get(`/posts/${id}`); 
      if (response.data && response.data.data) return response.data.data;
      return response.data || response; 
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
      return null; 
    }
  },

  likePost: async (id) => {
    // await axiosClient.post(`/posts/${id}/like`);
    return true; 
  },


  updatePost: async (id, formData) => {
    try {
      // Đảm bảo có _method: PUT để Laravel hiểu đây là request Update
      formData.append('_method', 'PUT'); 
      
      const response = await axiosClient.post(`/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data || response;
    } catch (error) {
      console.error("Lỗi cập nhật bài viết:", error);
      throw error;
    }
  },

  // [MỚI] Xóa bài viết
  deletePost: async (id) => {
    try {
      const response = await axiosClient.delete(`/posts/${id}`);
      return response.data || response;
    } catch (error) {
      console.error("Lỗi xóa bài viết:", error);
      throw error;
    }
  },

  createComment: async (postId, content) => {
    try {
        const response = await axiosClient.post(`/bai-viet/${postId}/binh-luan`, {
            noi_dung: content
        });
        return response.data || response; 
    } catch (error) {
        throw error;
    }
  },

  // Trả lời bình luận (Reply)
  replyComment: async (commentId, content) => {
    try {
        const response = await axiosClient.post(`/binh-luan/${commentId}/tra-loi`, {
            noi_dung: content
        });
        return response.data || response;
    } catch (error) {
        throw error;
    }
  },

  // Sửa bình luận
  updateComment: async (commentId, content) => {
    try {
        const response = await axiosClient.put(`/binh-luan/${commentId}`, {
            noi_dung: content
        });
        return response.data || response;
    } catch (error) {
        throw error;
    }
  },

  // Xóa bình luận
  deleteComment: async (commentId) => {
    try {
        const response = await axiosClient.delete(`/binh-luan/${commentId}`);
        return response.data || response;
    } catch (error) {
        throw error;
    }
  },

  // Lấy danh sách câu trả lời của 1 comment
  getReplies: async (commentId) => {
      try {
          const response = await axiosClient.get(`/binh-luan/${commentId}/danh-sach-tra-loi`);
          return response.data || response;
      } catch (error) {
          console.error("Lỗi lấy câu trả lời:", error);
          return [];
      }
  },

  // =========================================================
  // 3. QUẢN LÝ LIKE (YÊU THÍCH)
  // =========================================================

  // Thích / Bỏ thích (Toggle)
  toggleLikePost: async (postId) => {
    try {
      const url = `/posts/${postId}/like`;
      // Backend có thể yêu cầu body chứa ma_bai_viet để validate
      const payload = { ma_bai_viet: postId }; 

      const response = await axiosClient.post(url, payload);
      return response.data || response;
    } catch (error) {
      console.error("Lỗi toggle like:", error);
      return null;
    }
  },

  // Lấy thông tin Like (Số lượng + Trạng thái user hiện tại)
  getPostLikeInfo: async (postId) => {
    try {
      const url = `/posts/${postId}/like-info`;
      const response = await axiosClient.get(url);
      return response.data || response; 
    } catch (error) {
      console.error("Lỗi lấy like info:", error);
      return null;
    }
  },

};
export default postService;