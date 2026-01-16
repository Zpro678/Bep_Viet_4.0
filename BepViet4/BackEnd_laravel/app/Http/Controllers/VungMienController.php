<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VungMien;
use App\Models\CongThuc;

class VungMienController extends Controller
{
    //
    // 2. Lấy danh sách tất cả vùng miền
    public function index()
    {
        $vungMien = VungMien::all();
        return response()->json([
            'message' => 'Lấy danh sách vùng miền thành công',
            'data' => $vungMien
        ], 200);
    }

    // 3. Lấy danh sách món ăn thuộc vùng miền cụ thể
    public function getRecipes($id)
    {
        // Bước 1: Tìm vùng miền xem có tồn tại không
        $vungMien = VungMien::find($id);

        if (!$vungMien) {
            return response()->json(['message' => 'Không tìm thấy vùng miền'], 404);
        }

        // Bước 2: Gọi Model Công Thức ra, tra cứu thủ công bằng 'where'
        // "Lấy tất cả công thức CÓ ma_vung_mien BẰNG $id"
        $danhSachMonAn = CongThuc::where('ma_vung_mien', $id)->get();

        // Bước 3: Xuất kết quả
        return response()->json([
            'message' => "Danh sách món ăn thuộc miền " . $vungMien->ten_vung_mien,
            'data' => $danhSachMonAn
        ], 200);
    }
}
