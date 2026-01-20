import axiosClient from '../api/axiosClient';

export const createRecipeService = {
  /**
   * API tạo công thức mới
   * @param {FormData} 
   */
  create: (formData) => {
  
    return axiosClient.post('/addRecipes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
  },
};