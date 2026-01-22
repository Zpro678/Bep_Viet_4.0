import axiosClient from '../api/axiosClient';

const  AdminApi = {

    getCongThucDangChoDuyet:()=>{
        const url = `/admin/recipes/getDanhSachChoDuyet`;
        return axiosClient.get(url);
    },
    /** 
    * @param {string|number}
    */ 
    getDetail: (id) => {
        return axiosClient.get(`/recipes/${id}/detail-full`);
    },
    // Duyệt hoặc Từ chối (status: 'cong_khai' | 'tu_choi')
    updateStatus: (id, status) => {
        return axiosClient.put(`/admin/recipes/${id}/duyetCT`, { status });
    },

    // API User
    getUsers: (params) => {
        return axiosClient.get('/admin/users', { params });
    },
    createUser: (data) => {
        return axiosClient.post('/admin/users', data);
    },
    updateUserStatus: (id) => {
        return axiosClient.put(`/admin/users/${id}/status`);
    },
    deleteUser: (id) => {
        return axiosClient.delete(`/admin/users/${id}`);
    }
    
}

export default AdminApi;