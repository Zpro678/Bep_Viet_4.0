import axiosClient from '../api/axiosClient';

export const postService = {
  
  // ... (Giữ nguyên các hàm cũ: getFeed, createPost, getPostDetail) ...
  getFeed: async (params = {}) => {
    try {
      const response = await axiosClient.get('/posts', { params });
      const result = response.data; 
      if (result && result.data && Array.isArray(result.data)) return result.data; 
      if (Array.isArray(result)) return result;
      return [];
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
      return response.data; 
    } catch (error) {
      console.error("Lỗi tạo bài viết:", error);
      throw error;
    }
  },

  getPostDetail: async (id) => {
    try {

      const response = await axiosClient.get(`/posts/${id}`); 
      if (response.data && response.data.data) return response.data.data;

      return response.data; 
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
      return null; 
    }
  },



  likePost: async (id) => {
    // await axiosClient.post(`/posts/${id}/like`);
    return true; 
  },

  // --- CÁC HÀM MỚI CHO BÌNH LUẬN ---

  // 4. Gửi bình luận (Gốc)
  createComment: async (postId, content) => {
    try {
        const response = await axiosClient.post(`/bai-viet/${postId}/binh-luan`, {
            noi_dung: content
        });
        return response.data; 
    } catch (error) {
        throw error;
    }
  },

  // 5. Trả lời bình luận (Reply)
  replyComment: async (commentId, content) => {
    try {
        const response = await axiosClient.post(`/binh-luan/${commentId}/tra-loi`, {
            noi_dung: content
        });
        return response.data;
    } catch (error) {
        throw error;
    }
  },

  // 6. Sửa bình luận
  updateComment: async (commentId, content) => {
    try {
        const response = await axiosClient.put(`/binh-luan/${commentId}`, {
            noi_dung: content
        });
        return response.data;
    } catch (error) {
        throw error;
    }
  },

  // 7. Xóa bình luận
  deleteComment: async (commentId) => {
    try {
        const response = await axiosClient.delete(`/binh-luan/${commentId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
  },

  // 8. Lấy danh sách trả lời (Reply) của 1 comment
  getReplies: async (commentId) => {
      try {
          const response = await axiosClient.get(`/binh-luan/${commentId}/danh-sach-tra-loi`);
          return response.data.data || response.data;
      } catch (error) {
          console.error("Lỗi lấy câu trả lời:", error);
          return [];
      }
  },

  // 9. Thích / Bỏ thích (Toggle)
  toggleLikePost: async (postId) => {
    try {
      const url = `/posts/${postId}/like`;
      
      // QUAN TRỌNG: Backend yêu cầu 'ma_bai_viet' trong validate(), 
      // nên phải gửi kèm object này vào tham số thứ 2 của axios.post
      const payload = { ma_bai_viet: postId }; 

      const res = await axiosClient.post(url, payload);
      
      console.log("Service Toggle Like Data:", res);
      return res;
    } catch (error) {
      console.error("Lỗi toggle like:", error);
      return null;
    }
  },

  // 10. Lấy thông tin Like (Số lượng + Trạng thái đã like chưa)
  getPostLikeInfo: async (postId) => {
    try {
      const url = `/posts/${postId}/like-info`; // Kiểm tra lại route này bên Laravel
      const res = await axiosClient.get(url);
      
      // LOG ĐỂ KIỂM TRA (Sau này xóa đi)
      console.log("Service Like Info Data:", res); 

      // Vì interceptor đã bóc data, ta trả về res luôn
      return res; 
    } catch (error) {
      console.error("Lỗi lấy like info:", error);
      return null;
    }
  },

};