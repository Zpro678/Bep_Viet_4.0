<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/admin/recipes/getDanhSachChoDuyet', [AdminController::class, 'getCongThucChoDuyet']);
    Route::put('/admin/recipes/{id}/duyetCT', [AdminController::class, 'DuyetCongThuc']);
    Route::get('/admin/users', [AdminController::class, 'getDanhSachNguoiDung']); // Lấy danh sách + lọc
    Route::post('/admin/users', [AdminController::class, 'taoNguoiDung']);        // Tạo mới
    Route::put('/admin/users/{id}/status', [AdminController::class, 'doiTrangThaiNguoiDung']); // Khóa/Mở khóa
    Route::delete('/admin/users/{id}', [AdminController::class, 'xoaNguoiDung']);
    Route::get('/admin/dashboard-stats', [AdminController::class, 'getDashboardStats']);
});

