<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ThucDonController;

// --- Bảng Thực Đơn & Kế Hoạch ---
// 43. Xem lịch ăn uống (có thể truyền ?from_date=...&to_date=...)
Route::get('/meal-plans', [ThucDonController::class, 'index']);

// 44. Thêm món vào lịch
Route::post('/meal-plans', [ThucDonController::class, 'store']);

// 45. Xóa món khỏi lịch
Route::delete('/meal-plans/{id}', [ThucDonController::class, 'destroy']);