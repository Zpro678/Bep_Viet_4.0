// src/api/userApi.js
import axiosClient from './axiosClient';

const userApi = {
  
    getProfile: () => {
        return axiosClient.get('/users/profile');
    },

    updateProfile: (data) => {
        return axiosClient.put('/users/UpdateProfile', data);
    },

    getMeOverview: () => {
        return axiosClient.get('/users/meOverview');
    },

    getUserById: (id) => {
        return axiosClient.get(`/users/${id}`);
    },
    getUserOverview: (id) => {
        return axiosClient.get(`/users/${id}/overview`);
    },

    // 6. lấy danh sách công thức của người dùng khác
    getUserRecipes: (id) => {
        return axiosClient.get(`/users/${id}/recipes`);
    }
};

export default userApi;