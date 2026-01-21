<?php

use Illuminate\Http\Request;
use App\Http\Controllers\LuotThichController;
use Illuminate\Support\Facades\Route;


// 1. Route lấy thông tin like (GET) - Nên để public hoặc optional auth
Route::get('/posts/{id}/like-info', [LuotThichController::class, 'getLikeInfo']);

// 2. Route Thích/Bỏ thích
Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/posts/{ma_bai_viet}/like', [LuotThichController::class, 'toggleLike']);
    
});