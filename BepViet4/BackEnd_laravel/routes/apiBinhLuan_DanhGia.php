<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BinhLuanController;

// <!-- Binh Luan -->

Route::post('/recipes/{id}/comments', [BinhLuanController::class, 'store']);

// <!-- Binh luan bai viet -->

// <!-- danh gia -->