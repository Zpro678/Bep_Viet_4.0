<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

require __DIR__ . '/apiNguoiDung.php';
require __DIR__ . '/apiCongThuc.php';
require __DIR__ . '/apiTheoDoi.php';
require __DIR__ . '/apiBaiViet.php';
require __DIR__ . '/apiBoSuuTap.php';

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
