import axiosClient from './axiosClient';

const categoryApi = {
    getAll: () => {
        return axiosClient.get('/categories');
    },
    // 👇 THÊM HÀM NÀY ĐỂ LẤY CHI TIẾT 1 DANH MỤC
    getById: (id) => {
        return axiosClient.get(`/categories/${id}`);
    },
    create: (data) => {
        return axiosClient.post('/categories', data);
    },
    update: (id, data) => {
        return axiosClient.put(`/categories/${id}`, data);
    },
    delete: (id) => {
        return axiosClient.delete(`/categories/${id}`);
    }
};

export default categoryApi;