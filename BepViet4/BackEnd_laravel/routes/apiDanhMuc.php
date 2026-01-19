<?php

use Illuminate\Http\Request;
<<<<<<< HEAD
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DanhMucController;

Route::get('/categories', [DanhMucController::class, 'index']);

// Tạo danh mục mới (Nên thêm Middleware 'auth' hoặc 'admin' ở đây sau này)
Route::post('/categories', [DanhMucController::class, 'store']);
Route::put('/categories/{id}', [DanhMucController::class, 'update']);
=======
use Illuminate\Support\Facades\Route;
>>>>>>> 2a0fd928dbc5662ec43f263e0739c16ae8294922
