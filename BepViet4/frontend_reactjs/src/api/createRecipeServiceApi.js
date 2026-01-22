import axiosClient from './axiosClient';

const createRecipeService = {
  /**
   * API tạo công thức mới
   */
  create: (formData) => {
    return axiosClient.post('/addRecipes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  update: (id, formData) => {
    return axiosClient.post(`/recipes/${id}/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },

  delete: (id) => {
    return axiosClient.delete(`/recipes/${id}/destroy`);
  },

  // --- THÊM MỚI 2 HÀM NÀY ---
  
  // Lấy danh sách danh mục
  getCategories: () => {
    return axiosClient.get('/categories');
  },

  // Lấy danh sách vùng miền
  getRegions: () => {
    return axiosClient.get('/regions');
  }
};

export default createRecipeService;