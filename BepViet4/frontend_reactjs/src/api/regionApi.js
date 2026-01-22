import axiosClient from './axiosClient';

const regionApi = {
    // Lấy tất cả vùng miền
    getAll: () => {
        return axiosClient.get('/regions');
    },

    // Lấy chi tiết 1 vùng miền
    getById: (id) => {
        return axiosClient.get(`/regions/${id}`);
    },

    // Thêm mới
    create: (data) => {
        return axiosClient.post('/regions', data);
    },

    // Cập nhật
    update: (id, data) => {
        return axiosClient.put(`/regions/${id}`, data);
    },

    // Xóa
    delete: (id) => {
        return axiosClient.delete(`/regions/${id}`);
    },

    // Lấy công thức theo vùng miền (theo Controller bạn đưa)
    getRecipesByRegion: (id) => {
        return axiosClient.get(`/regions/${id}/recipes`);
    }
};

export default regionApi;