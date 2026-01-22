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

    // 5. Thống kê của user khác (Controller: overview)

    getUserOverview: (id) => {
        return axiosClient.get(`/users/${id}/overview`);
    },

    // 6. lấy danh sách công thức của người dùng khác
    getUserRecipes: (id) => {
        return axiosClient.get(`/users/${id}/recipes`);
    },

    // 7. lấy danh sách bài viết theo id của người dùng
    getUserPosts: (id) => {
        return axiosClient.get(`/users/${id}/posts`);
    },

    // 8. kiểm tra trạng thái theo dõi/ chưa theo dõi
    checkFollowStatus: (id) => {
        return axiosClient.get(`/users/${id}/follow-status`);
    },

    // 9. theo dõi
    followUser: (id) => {
        return axiosClient.post(`/users/${id}/follow`);
    },

    // 10. bỏ theo doi
    unfollowUser: (id) => {
        return axiosClient.delete(`/users/${id}/unfollow`);
    }

};

export default userApi;