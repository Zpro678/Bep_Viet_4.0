// src/services/mealPlannerService.js

// Định nghĩa enum cho các bữa ăn để tránh hardcode string nhiều nơi
export const MEAL_TYPES = {
  BREAKFAST: 'sang',
  LUNCH: 'trua',
  DINNER: 'toi'
};

export const mealPlannerService = {
  /**
   * Lấy lịch ăn uống theo khoảng thời gian
   * @param {string} startDate - Định dạng YYYY-MM-DD
   * @param {string} endDate - Định dạng YYYY-MM-DD
   */
  getMealPlan: async (startDate, endDate) => {
    // --- SAU NÀY KẾT NỐI LARAVEL ---
    // return axios.get('/api/meal-plans', { params: { start_date: startDate, end_date: endDate } });
    
    // --- HIỆN TẠI: GIẢ LẬP DỮ LIỆU ---
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          // Dữ liệu mẫu giả lập trả về từ DB Laravel
          {
            id: 1,
            date: "2024-05-20", // YYYY-MM-DD
            meal_type: "sang",  // enum: sang, trua, toi
            recipe: { id: 101, title: "Phở Bò", image: "https://via.placeholder.com/150" }
          },
          {
            id: 2,
            date: "2024-05-20",
            meal_type: "trua",
            recipe: { id: 102, title: "Cơm Tấm", image: "https://via.placeholder.com/150" }
          },
          {
            id: 3,
            date: "2024-05-21",
            meal_type: "toi",
            recipe: { id: 103, title: "Canh Chua", image: "https://via.placeholder.com/150" }
          }
        ]);
      }, 500);
    });
  },

  /**
   * Thêm/Cập nhật món ăn vào lịch
   */
  saveMeal: async (data) => {
    // Call API: axios.post('/api/meal-plans', data)
    console.log("Đang lưu xuống DB:", data);
    return Promise.resolve({ success: true });
  }
};