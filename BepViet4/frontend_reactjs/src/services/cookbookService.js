// src/components/services/cookbookService.js (hoặc src/services/cookbookService.js tùy cấu trúc của bạn)

// --- 1. DỮ LIỆU GIẢ (MOCK DATA) CHO DANH SÁCH BỘ SƯU TẬP ---
// Đây là biến bị thiếu gây ra lỗi "MOCK_DATA is not defined"
const MOCK_DATA = [
  {
    id: 1,
    title: 'Món ngon mỗi ngày',
    description: 'Tổng hợp các món ăn gia đình đơn giản, dễ làm cho bữa cơm hàng ngày.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80',
    recipes_count: 12,
    created_at: '2023-10-01'
  },
  {
    id: 2,
    title: 'Thực đơn Eat Clean',
    description: 'Các món ăn tốt cho sức khỏe, ít calo, phù hợp giảm cân.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=80',
    recipes_count: 8,
    created_at: '2023-11-15'
  },
  {
    id: 3,
    title: 'Món nhậu cuối tuần',
    description: 'Danh sách các món lai rai cho anh em tụ họp.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80',
    recipes_count: 5,
    created_at: '2023-12-20'
  }
];

// --- 2. DỮ LIỆU GIẢ CHO CHI TIẾT MÓN ĂN TRONG BỘ SƯU TẬP ---
const MOCK_RECIPES = [
  {
    id: 101,
    name: 'Phở Bò Tái Nạm',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=500&q=80',
    time: '45 phút',
    difficulty: 'Trung bình',
    calories: '450 kcal'
  },
  {
    id: 102,
    name: 'Bún Chả Hà Nội',
    image: 'https://images.unsplash.com/photo-1518331183-49fbba8491c4?auto=format&fit=crop&w=500&q=80',
    time: '60 phút',
    difficulty: 'Khó',
    calories: '600 kcal'
  },
  {
    id: 103,
    name: 'Gỏi Cuốn Tôm Thịt',
    image: 'https://images.unsplash.com/photo-1548545814-7e444455f52f?auto=format&fit=crop&w=500&q=80',
    time: '30 phút',
    difficulty: 'Dễ',
    calories: '200 kcal'
  }
];

// --- 3. SERVICE OBJECT ---
export const cookbookService = {
  // 1. Lấy tất cả bộ sưu tập
  getAll: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_DATA);
      }, 500); // Giả lập mạng chậm 0.5s
    });
  },

  // 2. Tạo bộ sưu tập mới
  create: (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newItem = {
          id: Math.floor(Math.random() * 1000) + 10,
          ...data,
          recipes_count: 0,
          created_at: new Date().toISOString().split('T')[0]
        };
        // Trong thực tế, server sẽ lưu và trả về item mới
        // Ở đây ta chỉ return về item để UI cập nhật
        resolve(newItem);
      }, 500);
    });
  },

  // 3. Xóa bộ sưu tập
  delete: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  },

  // 4. Lấy chi tiết bộ sưu tập + danh sách món ăn
  getById: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Tìm thông tin bộ sưu tập trong Mock Data
        // Lưu ý: id từ URL là string, id trong data là number nên cần toString()
        const collectionInfo = MOCK_DATA.find(item => item.id.toString() === id.toString());
        
        if (collectionInfo) {
          resolve({
            ...collectionInfo,
            recipes: MOCK_RECIPES // Giả lập trả về danh sách món ăn kèm theo
          });
        } else {
          // Trường hợp test: Nếu không tìm thấy trong MOCK_DATA (ví dụ click vào item mới tạo), 
          // tạo dữ liệu giả tạm để không bị lỗi trang
          resolve({
            id: id,
            title: `Bộ sưu tập #${id}`,
            description: 'Mô tả chi tiết cho bộ sưu tập này...',
            created_at: '2024-05-20',
            recipes: MOCK_RECIPES
          });
        }
      }, 500);
    });
  },

  // 5. Xóa món ăn khỏi bộ sưu tập
  removeRecipe: (collectionId, recipeId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 300);
    });
  }
};