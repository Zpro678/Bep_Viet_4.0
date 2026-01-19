<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NguyenLieu;

class NguyenLieuController extends Controller
{
    // 1. Cập nhật thông tin nguyên liệu
    public function update(Request $request, $id)
    {
        // Lấy user đang đăng nhập (Sanctum)
        $user = $request->user();

        // Check vai trò admin
        if ($user->vai_tro !== 'Admin') {
            return response()->json([
                'message' => 'Chỉ admin mới có quyền cập nhật nguyên liệu'
            ], 403);
        }

        // Tìm nguyên liệu theo khóa chính
        $nguyenLieu = NguyenLieu::find($id);

        if (!$nguyenLieu) {
            return response()->json([
                'message' => 'Không tìm thấy nguyên liệu'
            ], 404);
        }

        // Validate
        $validated = $request->validate([
            'ten_nguyen_lieu' => 'sometimes|string|max:255',
            'loai_nguyen_lieu' => 'sometimes|string|max:255',
            'hinh_anh' => 'nullable|string',
        ]);

        // Update
        $nguyenLieu->update($validated);

        return response()->json([
            'message' => 'Cập nhật nguyên liệu thành công',
            'data' => $nguyenLieu
        ], 200);
    }
}
