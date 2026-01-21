<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import các Controller
// Lưu ý: Đảm bảo namespace trong file Controller của bạn là App\Http\Controllers\Api
use App\Http\Controllers\BinhLuanController;         // Dành cho Công thức
use App\Http\Controllers\BinhLuanBaiVietController;  // Dành cho Bài viết (Vừa tạo)
use App\Http\Controllers\DanhGiaController;          // Dành cho Đánh giá

/*
|--------------------------------------------------------------------------
| API Routes - PUBLIC (Không cần đăng nhập)
|--------------------------------------------------------------------------
*/

// --- 1. Bình luận Công thức ---
// Lấy danh sách bình luận của 1 công thức
Route::get('/cong-thuc/{id}/binh-luan', [BinhLuanController::class, 'index'])->name('congThuc.dsBinhLuan'); // 51

// --- 2. Bình luận Bài viết ---
// Lấy danh sách bình luận của 1 bài viết (Dùng controller mới)
Route::get('/bai-viet/{id}/binh-luan', [BinhLuanBaiVietController::class, 'layBinhLuanBaiViet'])->name('baiViet.dsBinhLuan'); // 57

// --- 3. Tiện ích bình luận (Trả lời / Chi tiết) ---
// Lấy danh sách các câu trả lời (Reply) của 1 comment
Route::get('/binh-luan/{id}/danh-sach-tra-loi', [BinhLuanBaiVietController::class, 'layCauTraLoi'])->name('binhLuan.layCauTraLoi'); // 53
// Xem chi tiết 1 bình luận (nếu cần)
Route::get('/binh-luan/{id}', [BinhLuanBaiVietController::class, 'layBinhLuan'])->name('binhLuan.chiTiet');

// --- 4. Đánh giá (Rating) ---
// Xem thống kê đánh giá của công thức
Route::get('/recipes/{id}/ratings', [DanhGiaController::class, 'layThongKeDanhGia'])->name('danhGia.thongKe'); // 60


/*
|--------------------------------------------------------------------------
| API Routes - PROTECTED (Cần đăng nhập - Token Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // --- A. Tương tác với Công Thức ---
    // Đăng bình luận vào công thức
    Route::post('/recipes/{id}/comments', [BinhLuanController::class, 'store'])->name('congThuc.dangBinhLuan'); // 50
    
    // Đánh giá sao (Rating)
    Route::post('/recipes/{id}/ratings', [DanhGiaController::class, 'soSao'])->name('danhGia.tao'); // 58
    Route::put('/ratings/{id}', [DanhGiaController::class, 'suaDanhGia'])->name('danhGia.sua'); // 59


    // --- B. Tương tác với Bài Viết ---
    // Đăng bình luận vào bài viết (Bạn cần viết hàm store trong BinhLuanBaiVietController)
    Route::post('/bai-viet/{id}/binh-luan', [BinhLuanBaiVietController::class, 'store'])->name('baiViet.dangBinhLuan'); // 56
    

    // --- C. Quản lý Bình luận chung ---
    // Trả lời một bình luận (Reply)
    // Lưu ý: Cần viết hàm `traLoiBinhLuan` trong Controller tương ứng
    Route::post('/binh-luan/{id}/tra-loi', [BinhLuanBaiVietController::class, 'traLoiBinhLuan'])->name('binhLuan.traLoi'); // 52
    
    Route::put('/binh-luan/{id}', [BinhLuanBaiVietController::class, 'suaBinhLuan'])->name('binhLuan.sua');

    // Xóa bình luận
    Route::delete('/binh-luan/{id}', [BinhLuanBaiVietController::class, 'xoaBinhLuan'])->name('binhLuan.xoa'); // 54
    
    // Lịch sử bình luận của người dùng đang đăng nhập
    Route::get('/nguoi-dung/lich-su-binh-luan', [BinhLuanBaiVietController::class, 'lichSuBinhLuan'])->name('user.lichSuBinhLuan'); // 55
});