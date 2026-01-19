<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

<<<<<<< HEAD
=======
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

>>>>>>> 2a0fd928dbc5662ec43f263e0739c16ae8294922
require __DIR__ . '/apiNguoiDung.php';

require __DIR__ . '/apiCongThuc.php';

require __DIR__ . '/apiDanhSachMuaSam.php';

require __DIR__ . '/apiVungMien.php';

require __DIR__ . '/apiDanhMuc.php';

require __DIR__ . '/apiBaiViet.php';

require __DIR__ . '/apiBinhLuan_DanhGia.php';

require __DIR__ . '/apiHinhAnh.php';

require __DIR__ . '/apiTheoDoi.php';

require __DIR__ . '/apiThucDon.php';

require __DIR__ . '/apiVideo.php';

require __DIR__ . '/apiBoSuuTap_ChiTietBoSuuTap.php';

<<<<<<< HEAD
require __DIR__ . '/apiNguyenLieu.php';


=======
require __DIR__ . '/apiNguyenLieu.php';
>>>>>>> 2a0fd928dbc5662ec43f263e0739c16ae8294922
