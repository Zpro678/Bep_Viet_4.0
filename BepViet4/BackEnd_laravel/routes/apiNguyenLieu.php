<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NguyenLieuController;

Route::put('/ingredients/{id}', [NguyenLieuController::class, 'update']);