<?php

use Illuminate\Http\Request;
<<<<<<< HEAD
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DanhSachMuaSamController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/shopping-list', [DanhSachMuaSamController::class, 'index']);

    Route::post('/shopping-list', [DanhSachMuaSamController::class, 'store']);

    Route::put('/shopping-list/{id}/status', [DanhSachMuaSamController::class, 'updateStatus']);

    Route::delete('/shopping-list/{id}', [DanhSachMuaSamController::class, 'destroy']);
});
=======
use Illuminate\Support\Facades\Route;
>>>>>>> 2a0fd928dbc5662ec43f263e0739c16ae8294922
