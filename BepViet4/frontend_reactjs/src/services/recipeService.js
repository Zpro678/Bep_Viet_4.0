// src/services/recipeService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const recipeService = {
  // Đồng bộ với API tìm kiếm/lọc của bạn
  filterKhamPha: async (params) => {
    // API: http://localhost:8000/api/recipes/search
    const response = await axios.get(`${API_URL}/recipes/search`, { params });

    // Vì Backend dùng paginate(12), dữ liệu mảng nằm ở data.data.data
    // response.data -> object trả về từ Controller
    // response.data.data -> object Paginate của Laravel
    // response.data.data.data -> mảng chứa 12 công thức thực tế
    return response.data.data.data;
  },

  // ... các hàm khác
};