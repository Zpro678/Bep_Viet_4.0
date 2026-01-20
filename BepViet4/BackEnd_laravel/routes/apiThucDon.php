<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ThucDonController;


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/meal-plans', [ThucDonController::class, 'index']);

    Route::post('/meal-plans', [ThucDonController::class, 'store']);

    Route::delete('/meal-plans/{id}', [ThucDonController::class, 'destroy']);
});

