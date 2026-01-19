<?php

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VungMienController;

Route::get('/regions', [VungMienController::class, 'index']);

Route::get('/regions/{id}/recipes', [VungMienController::class, 'getRecipes']);

