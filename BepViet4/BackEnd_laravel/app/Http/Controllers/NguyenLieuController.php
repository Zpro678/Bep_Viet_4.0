<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NguyenLieu;

class NguyenLieuController extends Controller
{
    // 1. Cập nhật thông tin nguyên liệu
    public function update(Request $request, $id)
    {
        // Tìm nguyên liệu theo khóa chính (ma_nguyen_lieu)
        $nguyenLieu = NguyenLieu::find($id);

        if (!$nguyenLieu) {
            return response()->json(['message' => 'Không tìm thấy nguyên liệu'], 404);
        }

        // Validate dữ liệu đầu vào
        $request->validate([
            'ten_nguyen_lieu' => 'string|max:255',
            'loai_nguyen_lieu' => 'string|max:255',
            'hinh_anh' => 'nullable|string', // Giả sử gửi lên link ảnh hoặc tên file
        ]);

        // Cập nhật dữ liệu
        $nguyenLieu->update($request->all());

        return response()->json([
            'message' => 'Cập nhật nguyên liệu thành công',
            'data' => $nguyenLieu
        ], 200);
    }
}
