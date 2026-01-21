import axiosClient from '../api/axiosClient';

export const postService = {
  
  // 1. LẤY DANH SÁCH
  getFeed: async (params = {}) => {
    try {
      const response = await axiosClient.get('/posts', { params });
      const result = response.data; 
      if (result && result.data && Array.isArray(result.data)) {
        return result.data; 
      }
      if (Array.isArray(result)) {
        return result;
      }
      return [];
    } catch (error) {
      console.error("Lỗi lấy bài viết:", error);
      return [];
    }
  },

  // 2. TẠO BÀI VIẾT
  createPost: async (formData) => {
    try {
      const response = await axiosClient.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data; 
    } catch (error) {
      console.error("Lỗi tạo bài viết:", error);
      throw error;
    }
  },

  // 3. CHI TIẾT (ĐÃ SỬA)
  getPostDetail: async (id) => {
    try {
      // Gọi API
      const response = await axiosClient.get(`/posts/${id}`);
      
      // Axios trả về object response, dữ liệu thực nằm trong response.data
      // Backend Laravel (nếu dùng Model::find) sẽ trả về JSON object của bài viết
      return response.data; 
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
      return null; // Trả về null để bên Component biết mà hiển thị lỗi
    }
  },

  // 4. LIKE
  likePost: async (id) => {
    // await axiosClient.post(`/posts/${id}/like`);
    return true; 
  }
};