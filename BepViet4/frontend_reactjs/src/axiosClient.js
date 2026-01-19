// src/api/axiosClient.js
import axios from 'axios';

// 1. Cấu hình cơ bản
const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Thay đổi nếu bạn deploy lên host khác
    headers: {
        'Content-Type': 'application/json',
        // 'Accept' giúp Laravel trả về JSON khi có lỗi thay vì HTML
        'Accept': 'application/json', 
    },
});

// 2. Interceptor cho Request (Trước khi gửi đi)
// Tác dụng: Tự động lấy token từ LocalStorage gắn vào Header
axiosClient.interceptors.request.use(async (config) => {
    // Giả sử bạn lưu token với tên 'ACCESS_TOKEN' trong localStorage
    const token = localStorage.getItem('ACCESS_TOKEN');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 3. Interceptor cho Response (Sau khi nhận về)
// Tác dụng: 
// - Lấy dữ liệu gọn hơn (bỏ qua lớp data của axios)
// - Xử lý lỗi chung (ví dụ: hết hạn token thì tự logout)
axiosClient.interceptors.response.use((response) => {
    // Axios gói kết quả trong thuộc tính .data, ta lấy nó ra luôn cho tiện
    if (response && response.data) {
        return response.data;
    }
    return response;
}, (error) => {
    // Xử lý các lỗi phổ biến
    const { status } = error.response || {};

    if (status === 401) {
        // 401: Unauthorized (Token hết hạn hoặc sai)
        // Xóa token và đá về trang đăng nhập
        localStorage.removeItem('ACCESS_TOKEN');
        // window.location.href = '/login'; 
    }

    // Ném lỗi ra để component tự xử lý tiếp (hiện thông báo...)
    throw error;
});

export default axiosClient;