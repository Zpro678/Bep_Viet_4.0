import axios from 'axios';

// 1. Cấu hình cơ bản cho Axios
// Lưu ý: Đổi cổng 8000 nếu server Laravel của bạn chạy cổng khác
const API_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});


apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN'); // Hoặc nơi bạn lưu token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. Service Object gọi API thật
export const cookbookService = {
    
    // --- LẤY DANH SÁCH (GET /collections) ---
    getAll: async () => {
        try {
            const response = await apiClient.get('/collections');
            // Laravel trả về: { status: true, message: "...", data: [...] }
            return response.data.data; 
        } catch (error) {
            console.error("Lỗi lấy danh sách BST:", error);
            throw error;
        }
    },

    // --- TẠO MỚI (POST /collections) ---
    create: async (name) => {
        try {
            const response = await apiClient.post('/collections', {
                ten_bo_suu_tap: name // Phải khớp với key trong $request->ten_bo_suu_tap của Laravel
            });
            return response.data.data; // Trả về object bộ sưu tập vừa tạo
        } catch (error) {
            console.error("Lỗi tạo BST:", error);
            throw error;
        }
    },

    // --- CẬP NHẬT TÊN (PUT /collections/{id}) ---
    update: async (id, name) => {
        try {
            const response = await apiClient.put(`/collections/${id}`, {
                ten_bo_suu_tap: name
            });
            return response.data.data;
        } catch (error) {
            console.error("Lỗi cập nhật BST:", error);
            throw error;
        }
    },

    // --- XÓA BỘ SƯU TẬP (DELETE /collections/{id}) ---
    delete: async (id) => {
        try {
            const response = await apiClient.delete(`/collections/${id}`);
            return response.data; // Trả về { status: true, message: "..." }
        } catch (error) {
            console.error("Lỗi xóa BST:", error);
            throw error;
        }
    },

    // --- LẤY CHI TIẾT + CÔNG THỨC (GET /collections/{id}) ---
    getById: async (id) => {
        try {
            const response = await apiClient.get(`/collections/${id}`);
            // Laravel trả về object BoSuuTap có kèm relation 'congThucs'
            return response.data.data; 
        } catch (error) {
            console.error("Lỗi lấy chi tiết BST:", error);
            throw error;
        }
    },

    // --- THÊM CÔNG THỨC VÀO BST (POST /collections/{id}/recipes) ---
    addRecipe: async (collectionId, recipeId, note = '') => {
        try {
            const response = await apiClient.post(`/collections/${collectionId}/recipes`, {
                ma_cong_thuc: recipeId, // Khớp với validate Laravel
                ghi_chu: note
            });
            return response.data;
        } catch (error) {
            // Lỗi 409: Đã tồn tại, Lỗi 422: Dữ liệu sai
            console.error("Lỗi thêm công thức:", error);
            throw error;
        }
    },

    // --- XÓA CÔNG THỨC KHỎI BST (DELETE /collections/{id}/recipes/{recipeId}) ---
    removeRecipe: async (collectionId, recipeId) => {
        try {
            const response = await apiClient.delete(`/collections/${collectionId}/recipes/${recipeId}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi xóa công thức khỏi BST:", error);
            throw error;
        }
    }
};