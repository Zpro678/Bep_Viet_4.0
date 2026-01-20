<?php

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NguoiDungController;
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);

Route::get('/users/{id}', [NguoiDungController::class, 'show'])->where('id', '[0-9]+');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/users/profile', [NguoiDungController::class, 'profile']);
    Route::put('/users/UpdateProfile', [NguoiDungController::class, 'updateProfile']);
    Route::get('/users/{id}/overview', [NguoiDungController::class, 'overview']);
    Route::get('/users/meOverview', [NguoiDungController::class, 'meOverview']);
});
