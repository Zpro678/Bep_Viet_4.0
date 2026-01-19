// src/services/recipeService.js

// Dữ liệu mẫu (Sau này xóa đi khi có API thật)
const MOCK_RECIPES = [
  { 
    id: 1, 
    title: "Bánh Mì Chảo", 
    image: "https://images.unsplash.com/photo-1593560708920-63984657d724", 
    author: "Tuấn Hưng",
    description: "Món ngon đường phố..." 
  },
  { id: 2, title: "Phở Bò Tái", image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43", author: "Bếp Cô Minh" },
  { id: 3, title: "Cơm Tấm Sườn", image: "https://images.unsplash.com/photo-1595561569198-1e4e3725790c", author: "Sài Gòn Food" },
  { id: 4, title: "Salad Cá Ngừ", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd", author: "Healthy Life" },
  { id: 5, title: "Pasta Ý", image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8", author: "Chef Gordon" },
  { id: 6, title: "Pizza Hải Sản", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3", author: "Pizza Hut" },
  { id: 7, title: "Bún Chả", image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369", author: "Hà Nội Quán" },
  { id: 8, title: "Kem Bơ", image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc", author: "Sweet Dream" },
];

export const recipeService = {
  // 1. Hàm lấy danh sách món ăn
  getAll: async () => {
    // Giả lập độ trễ mạng (Network Latency) giống như gọi API thật từ Laravel
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_RECIPES);
      }, 500); 
    });

    // --- SAU NÀY KHI CÓ LARAVEL, BẠN CHỈ CẦN ĐỔI THÀNH ---
    // const response = await fetch('http://localhost:8000/api/recipes');
    // return await response.json();
  },

  // 2. Hàm lưu món ăn (Ví dụ gọi API POST)
  saveRecipe: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Đã gọi API lưu món id: ${id} lên server`);
        resolve(true);
      }, 300);
    });
  }
};