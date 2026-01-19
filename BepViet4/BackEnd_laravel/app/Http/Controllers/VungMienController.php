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
        $vungMien = VungMien::find($id);
        if (!$vungMien) {
            return response()->json(['message' => 'Không tìm thấy vùng miền'], 404);
        }

        // SỬA LẠI ĐOẠN NÀY CHO KHỚP VỚI DB CỦA BẠN
        $danhSachMonAn = CongThuc::query()
            // 1. Chọn cột hiển thị (đổi users.name thành nguoi_dung.ho_ten)
            ->select('cong_thuc.*', 'nguoi_dung.ho_ten as ten_nguoi_tao')

            // 2. Join đúng tên bảng và khóa chính
            ->leftJoin('nguoi_dung', 'cong_thuc.ma_nguoi_dung', '=', 'nguoi_dung.ma_nguoi_dung')

            ->where('cong_thuc.ma_vung_mien', $id)
            ->get();

        return response()->json([
            'message' => "Danh sách món ăn thuộc miền " . $vungMien->ten_vung_mien,
            'data' => $danhSachMonAn
        ], 200);
    }
}
