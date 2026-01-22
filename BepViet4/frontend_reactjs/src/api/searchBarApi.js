import axiosClient from './axiosClient';

const searchBarApi = {
    /**
     * Tìm kiếm Real-time & Lọc kết hợp
     * URL: /recipes/search
     * * @param {Object} params - Object chứa các tiêu chí lọc
     * Cấu trúc params:
     * {
     * keyword: string,       // Từ khóa (Real-time input)
     * ma_vung_mien: number,  // ID vùng miền
     * do_kho: string,        // 'De' | 'TrungBinh' | 'Kho'
     * thoi_gian_nau: number, // Số phút (VD: 30, 60)
     * page: number,          // Trang hiện tại (nếu có phân trang)
     * limit: number          // Số lượng hiển thị
     * }
     */
    search: (params) => {
        // axios sẽ tự động chuyển object params thành query string
        // VD: /recipes/search?keyword=pho&ma_vung_mien=1
        return axiosClient.get('/recipes/search', { params });
    },

    // (Tùy chọn) API lấy danh sách Vùng miền để đổ vào Dropdown lọc
    getRegions: () => {
        return axiosClient.get('/regions'); 
    },

    // (Tùy chọn) API lấy danh sách Danh mục để đổ vào Dropdown lọc
    getCategories: () => {
        return axiosClient.get('/categories');
    }
};

export default searchBarApi;