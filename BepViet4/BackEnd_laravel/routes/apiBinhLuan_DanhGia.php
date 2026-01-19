<?php

<<<<<<< HEAD
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BinhLuanController;

// <!-- Binh Luan -->
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/recipes/{id}/comments', [BinhLuanController::class, 'store']);

});

// <!-- Binh luan bai viet -->

// <!-- danh gia -->
=======
use App\Http\Controllers\api\BinhLuanController;
use App\Http\Controllers\api\DanhGiaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/cong-thuc/{id}/binh-luan', [BinhLuanController::class, 'layBinhLuan'])->name('layBinhLuan'); // 51
Route::post('/binh-luan/{id}/tra-loi', [BinhLuanController::class, 'traLoiBinhLuan'])->name('traLoiBinhLuan'); // 52
Route::get('/binh-luan/{id}/danh-sach-tra-loi', [BinhLuanController::class, 'layCauTraLoi'])->name('layCauTraLoi'); // 53
Route::delete('/binh-luan/{id}', [BinhLuanController::class, 'xoaBinhLuan'])->name('xoaBinhLuan'); // 54
Route::get('/nguoi-dung/{id}/binh-luan', [BinhLuanController::class, 'lichSuBinhLuan'])->name('lichSuBinhLuan'); // 55
Route::post('/bai-viet/{id}/binh-luan', [BinhLuanController::class, 'binhLuanBaiViet'])->name('binhLuanBaiViet'); // 56
Route::get('/bai-viet/{id}/binh-luan', [BinhLuanController::class, 'layBinhLuanBaiViet'])->name('layBinhLuanBaiViet'); // 57

Route::post('/recipes/{id}/ratings', [DanhGiaController::class, 'soSao'])->name('soSao'); // 58
Route::put('/ratings/{id}', [DanhGiaController::class, 'suaDanhGia'])->name('suaDanhGia'); // 59
Route::get('/recipes/{id}/ratings', [DanhGiaController::class, 'layThongKeDanhGia'])->name('layThongKeDanhGia'); // 60



// Route::get('/recipes/{id}/comments', [BinhLuanController::class, 'layBinhLuan'])->name('layBinhLuan'); // 51
// Route::post('/comments/{id}/reply', [BinhLuanController::class, 'traLoiBinhLuan'])->name('traLoiBinhLuan'); // 52
// Route::get('/comments/{id}/replies', [BinhLuanController::class, 'layCauTraLoi'])->name('layCauTraLoi'); // 53
// Route::delete('/comments/{id}', [BinhLuanController::class, 'xoaBinhLuan'])->name('xoaBinhLuan'); // 54
// Route::get('/users/{id}/comments', [BinhLuanController::class, 'lichSuBinhLuan'])->name('lichSuBinhLuan'); // 55
// Route::post('/posts/{id}/comments', [BinhLuanController::class, 'binhLuanBaiViet'])->name('binhLuanBaiViet'); // 56
// Route::get('/posts/{id}/comments', [BinhLuanController::class, 'layBinhLuanBaiViet'])->name('layBinhLuanBaiViet'); // 57

// Route::post('/recipes/{id}/ratings', [DanhGiaController::class, 'soSao'])->name('soSao'); // 58
// Route::put('/ratings/{id}', [DanhGiaController::class, 'suaDanhGia'])->name('suaDanhGia'); // 59
// Route::get('/recipes/{id}/ratings', [DanhGiaController::class, 'layThongKeDanhGia'])->name('layThongKeDanhGia'); // 60
>>>>>>> 2a0fd928dbc5662ec43f263e0739c16ae8294922
