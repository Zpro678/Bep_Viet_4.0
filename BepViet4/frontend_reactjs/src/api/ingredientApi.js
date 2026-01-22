import axiosClient from './axiosClient';

const ingredientApi = {
    // Lấy danh sách nguyên liệu
    getAll: () => {
        return axiosClient.get('/ingredients');
    },

    // Lấy chi tiết
    getById: (id) => {
        return axiosClient.get(`/ingredients/${id}`);
    },

    // Thêm mới nguyên liệu
    create: (data) => {
        return axiosClient.post('/ingredients', data);
    },

    // Cập nhật nguyên liệu
    update: (id, data) => {
        return axiosClient.put(`/ingredients/${id}`, data);
    },

    // Xóa nguyên liệu
    delete: (id) => {
        return axiosClient.delete(`/ingredients/${id}`);
    }
};

export default ingredientApi;