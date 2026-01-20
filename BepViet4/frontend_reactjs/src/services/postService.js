import axiosClient from '../api/axiosClient';

export const postService = {
  
  // 1. LẤY DANH SÁCH
  getFeed: async (params = {}) => {
    try {
      const response = await axiosClient.get('/posts', { params });
      // Xử lý dữ liệu trả về linh hoạt (do Laravel paginate trả về object, còn list thường trả về array)
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

  // 2. TẠO BÀI VIẾT (QUAN TRỌNG: FIX HEADER ĐỂ GỬI FILE)
  createPost: async (formData) => {
    try {
      const response = await axiosClient.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Bắt buộc phải có dòng này khi gửi File
        },
      });
      
      if (response && (response.status === 200 || response.status === 201)) {
          return response.data;
      }
      return response.data; 
    } catch (error) {
      console.error("Lỗi tạo bài viết:", error);
      throw error; // Ném lỗi ra để Home.js bắt được và hiển thị alert
    }
  },

  // 3. CHI TIẾT
  getPostDetail: async (id) => {
    try {
      const response = await axiosClient.get(`/posts/${id}`);
      return response.status === 200 ? response.data : null;
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
      throw error;
    }
  },

  // 4. LIKE
  likePost: async (id) => {
    // await axiosClient.post(`/posts/${id}/like`);
    return true; 
  }
};