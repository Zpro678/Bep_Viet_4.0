<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BoSuuTap; 
use App\Models\ChiTietBoSuuTap;
use Illuminate\Support\Facades\Validator;

class BoSuuTap_ChiTietBoSuuTapController extends Controller
{
    public function updateName(Request $request, $id)
    {
        // 1. Validate dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'ten_bo_suu_tap' => 'required|string|max:255',
        ], [
            'ten_bo_suu_tap.required' => 'Vui lòng nhập tên bộ sưu tập',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi dữ liệu',
                'errors' => $validator->errors()
            ], 422);
        }

        // 2. Tìm bộ sưu tập theo ID (ma_bo_suu_tap)
        // Model BoSuuTap đã khai báo primaryKey = 'ma_bo_suu_tap' nên dùng find($id) là được
        $boSuuTap = BoSuuTap::find($id);

        if (!$boSuuTap) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy bộ sưu tập'
            ], 404);
        }

        // 3. Cập nhật tên mới
        $boSuuTap->ten_bo_suu_tap = $request->ten_bo_suu_tap;
        $boSuuTap->save();

        // 4. Trả về kết quả
        return response()->json([
            'status' => true,
            'message' => 'Đổi tên bộ sưu tập thành công',
            'data' => $boSuuTap
        ], 200);
    }

    public function delete($id)
    {
        // 1. Tìm bộ sưu tập xem có tồn tại không
        $boSuuTap = BoSuuTap::find($id);

        if (!$boSuuTap) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy bộ sưu tập'
            ], 404);
        }

        // 2. Xóa tất cả chi tiết (công thức) thuộc bộ sưu tập này trước
        ChiTietBoSuuTap::where('ma_bo_suu_tap', $id)->delete();

        // 3. Sau khi dọn dẹp bên trong, tiến hành xóa bộ sưu tập cha
        $boSuuTap->delete();

        return response()->json([
            'status' => true,
            'message' => 'Đã xóa bộ sưu tập và toàn bộ công thức bên trong'
        ], 200);
    }

    public function show($id)
    {
        $boSuuTap = BoSuuTap::with('congThucs')->find($id);

        if (!$boSuuTap) {
            return response()->json(['message' => 'Không tìm thấy bộ sưu tập'], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Lấy dữ liệu thành công',
            'data' => $boSuuTap
        ], 200);
    }

    public function addRecipe(Request $request, $id)
    {
        // 1. Validate dữ liệu: Bắt buộc phải có mã công thức
        $validator = Validator::make($request->all(), [
            'ma_cong_thuc' => 'required|integer|exists:cong_thuc,ma_cong_thuc', // Kiểm tra xem công thức có tồn tại trong bảng cong_thuc không
            'ghi_chu'      => 'nullable|string'
        ], [
            'ma_cong_thuc.required' => 'Vui lòng chọn công thức cần thêm',
            'ma_cong_thuc.exists'   => 'Công thức này không tồn tại',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => false,
                'message' => 'Lỗi dữ liệu đầu vào',
                'errors'  => $validator->errors()
            ], 422);
        }

        // 2. Tìm bộ sưu tập
        $boSuuTap = BoSuuTap::find($id);
        if (!$boSuuTap) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy bộ sưu tập'
            ], 404);
        }

        // 3. Kiểm tra xem công thức này đã có trong bộ sưu tập chưa (Tránh trùng lặp)
        // Hàm whereHas hoặc kiểm tra trong relation
        $exists = $boSuuTap->congThucs()->where('chi_tiet_bo_suu_tap.ma_cong_thuc', $request->ma_cong_thuc)->exists();
        
        if ($exists) {
            return response()->json([
                'status'  => false,
                'message' => 'Công thức này đã có trong bộ sưu tập rồi'
            ], 409); // 409 Conflict
        }

        // 4. Thêm vào bảng trung gian (attach)
        // attach(id_công_thức, [các_cột_phụ_trong_bảng_trung_gian])
        $boSuuTap->congThucs()->attach($request->ma_cong_thuc, [
            'ngay_them' => now(), // Lấy thời gian hiện tại
            'ghi_chu'   => $request->ghi_chu
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Thêm công thức vào bộ sưu tập thành công'
        ], 201);
    }

    public function removeRecipe($id, $recipeId)
    {
        // 1. Tìm bộ sưu tập
        $boSuuTap = BoSuuTap::find($id);

        if (!$boSuuTap) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy bộ sưu tập'
            ], 404);
        }

        // 2. Xóa liên kết (Detach)
        // Hàm detach() sẽ tìm trong bảng trung gian và xóa dòng có cặp (ma_bo_suu_tap, ma_cong_thuc) tương ứng.
        // Nó trả về số lượng dòng đã xóa (0 nếu không tìm thấy, 1 nếu xóa thành công).
        $result = $boSuuTap->congThucs()->detach($recipeId);

        if ($result === 0) {
            return response()->json([
                'status' => false,
                'message' => 'Công thức này không có trong bộ sưu tập (hoặc ID công thức không đúng)'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Đã xóa công thức khỏi bộ sưu tập thành công'
        ], 200);
    }
}