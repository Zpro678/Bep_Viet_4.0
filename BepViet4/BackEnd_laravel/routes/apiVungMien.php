<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VungMienController;

// 2. GET /regions: Lấy danh sách vùng miền
Route::get('/regions', [VungMienController::class, 'index']);

// 3. GET /regions/{id}/recipes: Lấy danh sách món ăn theo vùng miền
Route::get('/regions/{id}/recipes', [VungMienController::class, 'getRecipes']);