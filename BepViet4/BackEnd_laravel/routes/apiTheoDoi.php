<?php

use Illuminate\Http\Request;
<<<<<<< HEAD
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TheoDoiController;

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/users/{id}/follow', [TheoDoiController::class, 'follow'])->where('id', '[0-9]+'); 
    Route::delete('/users/{id}/unfollow', [TheoDoiController::class, 'unfollow'])->where('id', '[0-9]+');
    Route::get('/users/{id}/followers', [TheoDoiController::class, 'getFollowers'])->where('id', '[0-9]+');
});
=======
use Illuminate\Support\Facades\Route;
>>>>>>> 2a0fd928dbc5662ec43f263e0739c16ae8294922
