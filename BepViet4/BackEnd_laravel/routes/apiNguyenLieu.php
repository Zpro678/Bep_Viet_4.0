<?php

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NguyenLieuController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/ingredients', [NguyenLieuController::class, 'index']);
    Route::post('/ingredients', [NguyenLieuController::class, 'store']);
    Route::put('/ingredients/{id}', [NguyenLieuController::class, 'update']);

});

