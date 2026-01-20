import axiosClient from '../api/axiosClient';

const  AdminApi = {

    getCongThucDangChoDuyet:()=>{
        const url = `/recipes/getDanhSachChoDuyet`;
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
        return axiosClient.put(`/recipes/${id}/duyetCT`, { status });
    }
    
}

export default AdminApi;