<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BinhLuan;
use App\Models\CongThuc;

class BinhLuanController extends Controller
{
    //
    // 50. POST /recipes/{id}/comments: Bình luận vào công thức
    public function store(Request $request, $id)
    {
        // 1. Kiểm tra xem công thức có tồn tại không
        $congThuc = CongThuc::find($id);
        if (!$congThuc) {
            return response()->json(['message' => 'Công thức không tồn tại'], 404);
        }

        // 2. Validate dữ liệu gửi lên
        $request->validate([
            'noi_dung' => 'required|string',
            'ma_binh_luan_cha' => 'nullable|exists:binh_luan,ma_binh_luan'
            // ma_binh_luan_cha: có thể null (bình luận gốc) hoặc phải là ID của 1 bình luận có thật (trả lời)
        ]);

        if ($request->filled('ma_binh_luan_cha')) {
            $binhLuanCha = BinhLuan::find($request->ma_binh_luan_cha);

            if ($binhLuanCha->ma_cong_thuc != $id) {
                return response()->json([
                    'message' => 'Bình luận cha không thuộc công thức này'
                ], 400);
            }
        }


        // 3. Tạo bình luận mới
        $binhLuan = BinhLuan::create([
            'ma_nguoi_dung'    => $request->user()->ma_nguoi_dung, // Lấy ID người đang đăng nhập

            // 'ma_nguoi_dung'    => $request->input('ma_nguoi_dung'),//Test API

            'ma_cong_thuc'     => $id,                  // Lấy ID công thức từ URL
            'ma_binh_luan_cha' => $request->input('ma_binh_luan_cha'), // Null hoặc ID cha
            'noi_dung'         => $request->input('noi_dung'),
            'ngay_gui'         => now(),                // Lấy thời gian hiện tại
        ]);

        // 4. Load thêm thông tin người dùng để trả về (Frontend cần để hiện tên/avatar ngay)
        $binhLuan->load('nguoiDung');

        return response()->json([
            'message' => 'Đăng bình luận thành công',
            'data' => $binhLuan
        ], 201);
    }
}
