<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CongThucController;
use App\Http\Controllers\BaiVietController;

// 23. Danh sách bài viết (phân trang, filter)
Route::get('/posts', [BaiVietController::class, 'index']);
//24. Tìm kiếm bài viêt trong trang chủ và lọc sản phẩm trang khám phá
Route::get('/home/search', [CongThucController::class, 'searchPost']);
Route::get('/explore/filter', [CongThucController::class, 'filterkhamPha']);
// 25. Chi tiết bài viết
Route::get('/posts/{id}', [BaiVietController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {

    // 24. Tạo bài viết mới
    Route::post('/posts', [BaiVietController::class, 'store']);

    // 26. Cập nhật bài viết
    Route::put('/posts/{id}', [BaiVietController::class, 'update']);

    // 27. Xóa bài viết
    Route::delete('/posts/{id}', [BaiVietController::class, 'destroy']);
});