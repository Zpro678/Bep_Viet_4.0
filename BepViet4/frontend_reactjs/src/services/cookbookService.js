import axiosClient from '../api/axiosClient';

export const cookbookService = {
    
    getAll: async () => {
        try {
            const response = await axiosClient.get('/collections');
            
            return response.data; 
        } catch (error) {
            console.error("Lỗi lấy danh sách BST:", error);
            throw error;
        }
    },

    create: async (name) => {
        try {
            const response = await axiosClient.post('/collections', {
                ten_bo_suu_tap: name 
            });
            return response.data; 
        } catch (error) {
            console.error("Lỗi tạo BST:", error);
            throw error;
        }
    },

    update: async (id, name) => {
        try {
            const response = await axiosClient.put(`/collections/${id}`, {
                ten_bo_suu_tap: name
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi cập nhật BST:", error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await axiosClient.delete(`/collections/${id}`);
            return response; 
        } catch (error) {
            console.error("Lỗi xóa BST:", error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await axiosClient.get(`/collections/${id}`);
            return response.data; 
        } catch (error) {
            console.error("Lỗi lấy chi tiết BST:", error);
            throw error;
        }
    },

    addRecipe: async (collectionId, recipeId, note = '') => {
        try {
            const response = await axiosClient.post(`/collections/${collectionId}/recipes`, {
                ma_cong_thuc: recipeId,
                ghi_chu: note
            });
            return response;
        } catch (error) {
            console.error("Lỗi thêm công thức:", error);
            throw error;
        }
    },

    removeRecipe: async (collectionId, recipeId) => {
        try {
            const response = await axiosClient.delete(`/collections/${collectionId}/recipes/${recipeId}`);
            return response;
        } catch (error) {
            console.error("Lỗi xóa công thức khỏi BST:", error);
            throw error;
        }
    }
};