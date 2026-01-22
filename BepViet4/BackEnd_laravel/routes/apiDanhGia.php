<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DanhGiaController;

Route::get('/recipes/{id}/ratings', [DanhGiaController::class, 'getRatingInfo']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/ratings', [DanhGiaController::class, 'submitRating']);
});