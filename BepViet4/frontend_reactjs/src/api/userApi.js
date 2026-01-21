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
        return axiosClient.put('/users/UpdateProfile', data/* The `)` in the code snippet is used to close the parameter list of a function. In JavaScript, functions are defined using the `function` keyword followed by the function name, parameters enclosed in parentheses, and the function body enclosed in curly braces. */
        );
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
    },

    // 6. lấy danh sách công thức của người dùng khác
    getUserRecipes: (id) => {
        return axiosClient.get(`/users/${id}/recipes`);
    }
};

export default userApi;