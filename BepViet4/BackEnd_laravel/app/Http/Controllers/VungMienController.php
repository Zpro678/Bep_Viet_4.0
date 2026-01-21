<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VungMien;
use App\Models\CongThuc;
use Illuminate\Support\Facades\Validator;
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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ten_vung_mien' => 'required|string|max:255|unique:vung_mien,ten_vung_mien',
            'hinh_anh' => 'nullable|string'
        ]);

        $vungMien = VungMien::create($validated);

        return response()->json([
            'message' => 'Thêm vùng miền thành công',
            'data' => $vungMien
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $vungMien = VungMien::find($id);

        if (!$vungMien) {
            return response()->json(['message' => 'Không tìm thấy vùng miền'], 404);
        }

        $validator = Validator::make($request->all(), [
            'ten_vung_mien' => 'sometimes|string|max:255|unique:vung_mien,ten_vung_mien,' . $id . ',ma_vung_mien',
            'hinh_anh' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $vungMien->update($request->all());

        return response()->json([
            'message' => 'Cập nhật vùng miền thành công',
            'data' => $vungMien
        ], 200);
    }
    public function destroy(Request $request, $id)
    {
        // Lấy user đang đăng nhập (Sanctum)
        $item = VungMien::find($id);
        if (!$item) {
            return response()->json(['message' => 'Không tìm thấy vùng miền'], 404);
        }

        try {
            $item->delete();
            return response()->json(['message' => 'Xóa vùng miền thành công'], 200);
        } catch (\Exception $e) {
            // Lỗi này xảy ra khi nguyên liệu đang được dùng ở bảng khác
            return response()->json([
                'message' => 'Không thể xóa! Nguyên liệu này đang được sử dụng trong các công thức.'
            ], 500);
        }
    }
}