<?php

use Illuminate\Http\Request;
<<<<<<< HEAD
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ThucDonController;

// --- Bảng Thực Đơn & Kế Hoạch ---
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/meal-plans', [ThucDonController::class, 'index']);

    Route::post('/meal-plans', [ThucDonController::class, 'store']);

    Route::delete('/meal-plans/{id}', [ThucDonController::class, 'destroy']);
});
=======
use Illuminate\Support\Facades\Route;
>>>>>>> 2a0fd928dbc5662ec43f263e0739c16ae8294922
