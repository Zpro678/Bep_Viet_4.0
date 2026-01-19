<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CongThucController;

Route::get('/recipes', [CongThucController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/recipes', [CongThucController::class, 'store']);

});