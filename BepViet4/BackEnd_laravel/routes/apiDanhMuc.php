<?php

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DanhMucController;

Route::get('/categories', [DanhMucController::class, 'index']);
Route::post('/categories', [DanhMucController::class, 'store']);
Route::put('/categories/{id}', [DanhMucController::class, 'update']);
Route::delete('/categories/{id}', [DanhMucController::class, 'delete']);