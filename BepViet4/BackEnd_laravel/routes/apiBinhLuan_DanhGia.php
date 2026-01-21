<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BinhLuanController;
use App\Http\Controllers\api\DanhGiaController;


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/recipes/{id}/comments', [BinhLuanController::class, 'store']);

});


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