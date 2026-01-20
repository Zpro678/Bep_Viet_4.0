<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DanhSachMuaSamController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/shopping-list', [DanhSachMuaSamController::class, 'index']);

    Route::post('/shopping-list', [DanhSachMuaSamController::class, 'store']);

    Route::put('/shopping-list/{id}/status', [DanhSachMuaSamController::class, 'updateStatus']);

    Route::delete('/shopping-list/{id}', [DanhSachMuaSamController::class, 'destroy']);
});

