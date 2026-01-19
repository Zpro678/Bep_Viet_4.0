<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NguoiDungController;
use App\Http\Controllers\TheoDoiController;

Route::post('/auth/register',[AuthController::class,'register']);
Route::post('/auth/login',[AuthController::class,'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/users/profile', [NguoiDungController::class, 'profile']);
    Route::put('/users/profile', [NguoiDungController::class, 'update']);

    Route::post('/users/{id}/follow', [TheoDoiController::class, 'follow']);
    Route::delete('/users/{id}/unfollow', [TheoDoiController::class, 'unfollow']);

    Route::get('/users/{id}/feed', [NguoiDungController::class, 'feed']);
});

Route::get('/users/{id}', [NguoiDungController::class, 'show']);
Route::get('/users/{id}/recipes', [NguoiDungController::class, 'recipes']);
Route::get('/users/{id}/overview', [NguoiDungController::class, 'overview']);
Route::get('/users/{id}/followers', [TheoDoiController::class, 'followers']);