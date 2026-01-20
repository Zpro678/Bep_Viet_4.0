// src/services/shoppingListService.js

export const shoppingListService = {
  /**
   * Lấy toàn bộ danh sách
   * GET /api/shopping-list
   */
  getList: async () => {
    // --- MOCK DATA (Giả lập Laravel trả về) ---
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, ingredient_name: "Thịt ba chỉ", quantity: 500, unit: "gram", is_bought: false },
          { id: 2, ingredient_name: "Hành tím", quantity: 5, unit: "củ", is_bought: true },
          { id: 3, ingredient_name: "Nước mắm", quantity: 1, unit: "chai", is_bought: false },
        ]);
      }, 500);
    });
  },

  /**
   * Thêm nguyên liệu mới
   * POST /api/shopping-list
   */
  addItem: async (item) => {
    // Backend Laravel sẽ trả về item vừa tạo kèm ID mới
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now(), // Fake ID
          ...item,
          is_bought: false
        });
      }, 300);
    });
  },

  /**
   * Cập nhật trạng thái (Đã mua / Chưa mua)
   * PATCH /api/shopping-list/{id}
   */
  toggleStatus: async (id, currentStatus) => {
    console.log(`Call API: Update ID ${id} -> is_bought: ${!currentStatus}`);
    return Promise.resolve(true);
  },

  /**
   * Xóa nguyên liệu
   * DELETE /api/shopping-list/{id}
   */
  deleteItem: async (id) => {
    console.log(`Call API: Delete ID ${id}`);
    return Promise.resolve(true);
  }
};