<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/recipes/getDanhSachChoDuyet', [AdminController::class, 'getCongThucChoDuyet']);
    Route::put('/recipes/{id}/duyetCT', [AdminController::class, 'DuyetCongThuc']);

});