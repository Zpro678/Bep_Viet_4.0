// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json', // Gửi lên dữ liệu dạng JSON"
        'Accept': 'application/json', // Trả về JSON (ko trả HTML)"
    },
});

// --- 1. Interceptor gửi Token (Giữ nguyên) ---
axiosClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- 2. Interceptor nhận kết quả (Giữ nguyên) ---
axiosClient.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }
    return response;
}, (error) => {
    // Xử lý lỗi
    throw error;
});

export default axiosClient;