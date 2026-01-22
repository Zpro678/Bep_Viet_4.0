<?php

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VungMienController;

Route::get('/regions', [VungMienController::class, 'index']);

Route::get('/regions/{id}', [VungMienController::class, 'show']);

Route::get('/regions/{id}/recipes', [VungMienController::class, 'getRecipes']);

Route::post('/regions', [VungMienController::class, 'store']);

Route::put('/regions/{id}', [VungMienController::class, 'update']);

Route::delete('/regions/{id}', [VungMienController::class, 'destroy']);