<?php

use Illuminate\Http\Request;
<<<<<<< HEAD
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NguyenLieuController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/ingredients', [NguyenLieuController::class, 'index']);
    Route::post('/ingredients', [NguyenLieuController::class, 'store']);
    Route::put('/ingredients/{id}', [NguyenLieuController::class, 'update']);

});
=======
use Illuminate\Support\Facades\Route;
>>>>>>> 2a0fd928dbc5662ec43f263e0739c16ae8294922
