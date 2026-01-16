<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DanhSachMuaSamController;

// 46. Xem danh sách
Route::get('/shopping-list', [DanhSachMuaSamController::class, 'index']);

// 47. Thêm món cần mua
Route::post('/shopping-list', [DanhSachMuaSamController::class, 'store']);

// 48. Đánh dấu đã mua/chưa mua (Check/Uncheck)
Route::put('/shopping-list/{id}/status', [DanhSachMuaSamController::class, 'updateStatus']);

// Xóa món khỏi danh sách
Route::delete('/shopping-list/{id}', [DanhSachMuaSamController::class, 'destroy']);