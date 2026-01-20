<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\BoSuuTapController;

Route::middleware('auth:sanctum')->group(function () {

    // 28. Danh sách bộ sưu tập của user hiện tại
    Route::get('/collections', [BoSuuTapController::class, 'index']);

    // 29. Tạo bộ sưu tập mới
    Route::post('/collections', [BoSuuTapController::class, 'store']);
});
