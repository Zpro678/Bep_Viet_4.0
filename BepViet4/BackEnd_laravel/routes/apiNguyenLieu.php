<?php

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NguyenLieuController;
Route::post('/ingredients', [NguyenLieuController::class, 'store']);
Route::put('/ingredients/{id}', [NguyenLieuController::class, 'update']);
Route::get('/ingredients', [NguyenLieuController::class, 'index']);
Route::delete('/ingredients/{id}', [NguyenLieuController::class, 'destroy']);
Route::middleware('auth:sanctum')->group(function () {



});