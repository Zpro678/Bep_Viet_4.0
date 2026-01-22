<?php

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CongThucController;

Route::middleware('auth:sanctum')->group(function(){
    
    Route::post('/addRecipes', [CongThucController::class, 'store']);
    Route::get('/feed', [CongThucController::class, 'getNewsFeed']);

    // (Trang Công thức cá nhân)
    Route::get('/users/{id}/my-recipes', [CongThucController::class, 'getCongThucCuaToi']);

    // EXPLORE(Trang Khám phá) – CHỈ CÔNG THỨC – ƯU TIÊN NGƯỜI THEO DÕI
    Route::get(
        '/users/{id}/explore/recipes',
        [CongThucController::class, 'exploreCongThuc']
    )->where('id', '[0-9]+');
});
Route::get('/users/{id}/recipes',[CongThucController::class, 'getDanhSachCongThuc'])->where('id', '[0-9]+');

// EXPLORE(Trang Khám phá) – CHỈ CÔNG THỨC – ƯU TIÊN NGƯỜI THEO DÕI
Route::get(
    '/explore/recipes',
    [CongThucController::class, 'getDanhSachCongThuc_KhamPha']
);



Route::middleware('auth:sanctum')->group(function () {
    Route::post('/recipes', [CongThucController::class, 'store']);

    // 17. Cập nhật công thức
    Route::post('/recipes/{id}/update', [CongThucController::class, 'update']);

    // 18. Xóa công thức
    Route::delete('/recipes/{id}/destroy', [CongThucController::class, 'destroy']);

    // 21. Thêm / sửa nguyên liệu cho công thức
    Route::post('/recipes/{id}/ingredients', [CongThucController::class, 'syncIngredients']);

    // 22. Gán / cập nhật danh mục cho công thức
    Route::post('/recipes/{id}/categories', [CongThucController::class, 'updateCategory']);
});

// 19. Công thức phổ biến / thịnh hành
Route::get('/recipes/popular', [CongThucController::class, 'popular']);

// 20. Tìm kiếm công thức nâng cao
Route::get('/recipes/search', [CongThucController::class, 'search']);

// 16. Xem chi tiết đầy đủ (full detail)
Route::get('/recipes/{id}/detail-full', [CongThucController::class, 'showFull'])
    ->whereNumber('id');

// 15. Xem chi tiết công thức (cơ bản)
Route::get('/recipes/{id}', [CongThucController::class, 'show'])->whereNumber('id');


