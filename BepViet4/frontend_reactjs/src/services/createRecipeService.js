// src/services/createRecipeService.js

export const createRecipeService = {
  /**
   * Đăng công thức mới
   * POST /api/recipes
   * @param {FormData} formData - Dữ liệu form (File ảnh + Text)
   */
  create: async (formData) => {
    // --- CẤU HÌNH CHO LARAVEL SAU NÀY ---
    // const response = await axios.post('/api/recipes', formData, {
    //   headers: { 
    //     'Content-Type': 'multipart/form-data' // Bắt buộc để upload file
    //   }
    // });
    // return response.data;

    // --- GIẢ LẬP (MOCK) ---
    return new Promise((resolve, reject) => {
      console.log("--- [CreateRecipeService] Đang gửi dữ liệu ---");
      
      // Log kiểm tra dữ liệu trước khi gửi
      for (let pair of formData.entries()) {
        console.log(`Key: ${pair[0]} | Value:`, pair[1]); 
      }

      setTimeout(() => {
        // Giả lập thành công
        resolve({
          success: true,
          message: "Đăng bài thành công!",
          data: { 
            id: Math.floor(Math.random() * 9999),
            title: formData.get('title') 
          }
        });
        
        // Giả lập lỗi (mở ra nếu muốn test lỗi)
        // reject(new Error("Lỗi mạng hoặc server quá tải!"));
      }, 1500);
    });
  }
};