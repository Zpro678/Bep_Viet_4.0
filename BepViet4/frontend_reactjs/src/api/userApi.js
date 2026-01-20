// src/api/userApi.js
import axiosClient from './axiosClient';

const userApi = {
    // 1. Lấy thông tin cá nhân (Controller: profile)
    getProfile: () => {
        return axiosClient.get('/users/profile');
    },

    // 2. Cập nhật thông tin (Controller: updateProfile)
    // Data gửi lên gồm: { ho_ten, email, mat_khau (nếu có) }
    updateProfile: (data) => {
        return axiosClient.put('/users/UpdateProfile', data);
    },

    // 3. Thống kê của bản thân (Controller: meOverview)
    // Trả về: { id, ten_dang_nhap, ThongKe: { tong_cong_thuc, ... } }
    getMeOverview: () => {
        return axiosClient.get('/users/meOverview');
    },

    // 4. Xem thông tin cơ bản user khác (Controller: show)
    getUserById: (id) => {
        return axiosClient.get(`/users/${id}`);
    },
    
    // 5. Thống kê của user khác (Controller: overview)
    getUserOverview: (id) => {
        return axiosClient.get(`/users/${id}/overview`);
    }
};

export default userApi;