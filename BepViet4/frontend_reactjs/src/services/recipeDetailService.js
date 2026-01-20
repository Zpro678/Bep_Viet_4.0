// src/services/recipeDetailService.js

export const recipeDetailService = {
  getById: async (id) => {
    // Giả lập gọi API: axios.get('/api/recipes/' + id)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          // --- BẢNG: CONGTHUC ---
          id: id,
          title: "Bò Kho Bánh Mì", // Tên món ăn
          description: "Món bò kho đậm đà với thịt nạm pha gân được hầm mềm rục, thấm vị sả, hoa hồi, quế. Nước sốt sệt, màu nâu đỏ óng ánh, chấm cùng bánh mì giòn rụm là tuyệt phẩm cho bữa sáng hoặc bữa tối ấm cúng.",
          video_url: "https://www.youtube.com/watch?v=example", // Link video
          cooking_time: 120, // Thời gian nấu (phút)
          servings: 4, // Số người ăn
          difficulty: "Vừa", // Độ khó
          created_at: "2024-01-15 08:30:00", // Ngày đăng bài
          category_name: "Món Hầm", // Danh mục món
          region_name: "Miền Nam", // Vùng miền
          
          // Thông tin người đăng
          author: {
            id: 99,
            name: "Cô Ba Sài Gòn",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
          },
          // Ảnh bìa món ăn
          image: "https://images.unsplash.com/photo-1534939561126-855b8675af58?auto=format&fit=crop&w=1200&q=80",
          
          // Điểm đánh giá
          average_rating: 4.8,
          total_reviews: 35,

          // --- BẢNG: CONGTHUC_NGUYENLIEU ---
          ingredients: [
            { id: 1, name: "Thịt bò nạm (có gân)", type: "Thịt", quantity: 800, unit: "Gram" },
            { id: 2, name: "Cà rốt", type: "Rau củ", quantity: 3, unit: "Củ" },
            { id: 3, name: "Sả cây", type: "Gia vị", quantity: 6, unit: "Cây" },
            { id: 4, name: "Hành tây", type: "Rau củ", quantity: 1, unit: "Củ" },
            { id: 5, name: "Gói gia vị bò kho", type: "Gia vị", quantity: 1, unit: "Gói" },
            { id: 6, name: "Nước dừa tươi", type: "Nước", quantity: 1, unit: "Lít" },
            { id: 7, name: "Tương cà (Ketchup)", type: "Gia vị", quantity: 3, unit: "Thìa canh" },
            { id: 8, name: "Bột năng", type: "Gia vị", quantity: 2, unit: "Thìa canh" }
          ],

          // --- BẢNG: BUOCTHUCHIEN (Đã xoá ảnh) ---
          steps: [
            { 
              step_number: 1, 
              instruction: "Sơ chế nguyên liệu: Thịt bò rửa sạch với nước muối loãng, cắt khối vuông cỡ 4-5cm. Sả cây đập dập, cắt khúc. Cà rốt gọt vỏ, tỉa hoa, cắt khoanh dày. Hành tây cắt múi cau.", 
              time_per_step: 20
            },
            { 
              step_number: 2, 
              instruction: "Ướp thịt bò: Cho thịt vào tô lớn, ướp với gói gia vị bò kho, 1 thìa đường, 1 thìa hạt nêm, 1/2 thìa muối, 2 thìa dầu điều và một nửa phần sả đập dập. Trộn đều, để ngấm trong ít nhất 45 phút.", 
              time_per_step: 45
            },
            { 
              step_number: 3, 
              instruction: "Xào săn thịt: Bắc nồi lên bếp, phi thơm tỏi băm và phần sả còn lại với dầu ăn. Cho thịt bò đã ướp vào xào trên lửa lớn cho đến khi thịt săn lại, dậy mùi thơm.", 
              time_per_step: 15
            },
            { 
              step_number: 4, 
              instruction: "Hầm thịt: Đổ 1 lít nước dừa tươi và khoảng 500ml nước lọc vào nồi sao cho ngập mặt thịt. Cho thêm tương cà để tạo màu đẹp. Đun sôi rồi hạ lửa nhỏ, hầm liu riu trong khoảng 1h30 phút cho thịt mềm.", 
              time_per_step: 90
            },
            { 
              step_number: 5, 
              instruction: "Hoàn thiện: Khi thịt đã mềm, cho cà rốt và hành tây vào hầm thêm 15 phút. Cuối cùng, hòa tan bột năng với chút nước, đổ từ từ vào nồi để tạo độ sánh. Nêm nếm lại cho vừa miệng rồi tắt bếp.", 
              time_per_step: 15
            }
          ],

          // --- BẢNG: BINHLUAN & DANHGIA ---
          comments: [
            {
              id: 101,
              user_name: "Minh Tuấn",
              user_avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=50&q=60",
              content: "Công thức quá chuẩn luôn! Mình làm theo y hệt, thịt mềm, nước sốt đậm đà, cả nhà ai cũng khen nức nở. Chấm bánh mì thì hết sẩy.",
              rating: 5,
              created_at: "2024-01-16 10:00:00"
            },
            {
              id: 102,
              user_name: "Lan Anh",
              user_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=50&q=60",
              content: "Mình thích ăn cay nên cho thêm ít sa tế, vị rất tuyệt. Cảm ơn Cô Ba đã chia sẻ công thức.",
              rating: 5,
              created_at: "2024-01-17 09:30:00"
            }
          ]
        });
      }, 800);
    });
  }
};