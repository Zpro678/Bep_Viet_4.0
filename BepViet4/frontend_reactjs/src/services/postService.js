import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const postService = {
  // UC-24: Tìm kiếm bài viết ở trang chủ
  searchPosts: async (params) => {
    // params bao gồm: keyword
    const response = await axios.get(`${API_URL}/posts/search`, { params });
    return response.data.data; // Trả về đối tượng paginate
  },

  // UC-24: Lọc công thức ở trang khám phá (Dùng cho hàm filterkhamPha)
  filterRecipes: async (params) => {
    // params bao gồm: keyword, ma_danh_muc, ma_vung_mien, do_kho
    const response = await axios.get(`${API_URL}/recipes/search`, { params });
    return response.data.data;
  },

  getFeed: async () => {
    const response = await axios.get(`${API_URL}/feed`);
    return response.data.data;
  }
};