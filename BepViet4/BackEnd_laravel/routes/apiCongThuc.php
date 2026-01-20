<?php

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CongThucController;

Route::middleware('auth:sanctum')->group(function(){
    
    Route::get('/users/{id}/recipes', [CongThucController::class, 'getDanhSachCongThuc'])->where('id', '[0-9]+');
    Route::get('/feed', [CongThucController::class, 'getNewsFeed']);
    Route::post('/addRecipes', [CongThucController::class, 'store']);
});

