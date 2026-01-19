<?php

use Illuminate\Http\Request;
<<<<<<< HEAD
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CongThucController;

Route::middleware('auth:sanctum')->group(function(){
    
    Route::get('/users/{id}/recipes', [CongThucController::class, 'getDanhSachCongThuc'])->where('id', '[0-9]+');
    Route::get('/feed', [CongThucController::class, 'getNewsFeed']);
});
=======
use Illuminate\Support\Facades\Route;
>>>>>>> 2a0fd928dbc5662ec43f263e0739c16ae8294922
