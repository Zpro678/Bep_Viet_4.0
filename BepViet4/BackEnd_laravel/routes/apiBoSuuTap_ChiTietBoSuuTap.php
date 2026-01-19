<?php

use Illuminate\Http\Request;
<<<<<<< HEAD
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BoSuuTap_ChiTietBoSuuTapController;

Route::put('/collections/{id}', [BoSuuTap_ChiTietBoSuuTapController::class, 'updateName']);
Route::delete('/collections/{id}', [BoSuuTap_ChiTietBoSuuTapController::class, 'delete']);
Route::get('/collections/{id}', [BoSuuTap_ChiTietBoSuuTapController::class, 'show']);
Route::post('/collections/{id}/recipes', [BoSuuTap_ChiTietBoSuuTapController::class, 'addRecipe']);
Route::delete('/collections/{id}/recipes/{recipeId}', [BoSuuTap_ChiTietBoSuuTapController::class, 'removeRecipe']);
=======
use Illuminate\Support\Facades\Route;
>>>>>>> 2a0fd928dbc5662ec43f263e0739c16ae8294922
