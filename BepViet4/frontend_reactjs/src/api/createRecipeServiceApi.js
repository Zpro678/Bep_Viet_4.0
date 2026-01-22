import axiosClient from '../api/axiosClient';

 const createRecipeService = {
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

  update: (id, formData) => {
    return axiosClient.post(`/recipes/${id}/update`, formData, {
      headers: {
                'Content-Type': 'multipart/form-data', // Bắt buộc cho file upload
            }
    });
  },

  delete: (id) => {
  
    return axiosClient.delete(`/recipes/${id}/destroy`);
  },
};



export default createRecipeService;