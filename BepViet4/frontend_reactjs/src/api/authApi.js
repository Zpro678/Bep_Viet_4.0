// src/api/authApi.js
import axiosClient from './axiosClient';

const authApi = {
    // 1. Đăng ký
    register: (data) => {
        const url = '/auth/register';
        return axiosClient.post(url, data);
    },

    // 2. Đăng nhập
    login: (data) => {
        const url = '/auth/login';
        return axiosClient.post(url, data);
    },

    // 3. Đăng xuất (Cần cái này để xóa Token trên Server)
    logout: () => {
        const url = '/auth/logout';
        return axiosClient.post(url);
    },
};

export default authApi;