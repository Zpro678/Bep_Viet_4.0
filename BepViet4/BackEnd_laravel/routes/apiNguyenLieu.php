<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NguyenLieuController;

// 1. PUT /ingredients/{id}: Cập nhật thông tin nguyên liệu
Route::put('/ingredients/{id}', [NguyenLieuController::class, 'update']);