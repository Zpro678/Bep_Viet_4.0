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

        // TỐI ƯU: Nếu cần lấy thêm thông tin người tạo món ăn thì Join luôn user
        // Nếu chỉ lấy món ăn đơn thuần thì where là đủ, nhưng đây là ví dụ Join với bảng User
        $danhSachMonAn = CongThuc::select('cong_thuc.*', 'users.name as ten_nguoi_tao')
            ->leftJoin('users', 'cong_thuc.ma_nguoi_dung', '=', 'users.id')
            ->where('cong_thuc.ma_vung_mien', $id)
            ->get();

        return response()->json([
            'message' => "Danh sách món ăn thuộc miền " . $vungMien->ten_vung_mien,
            'data' => $danhSachMonAn
        ], 200);
    }
}
