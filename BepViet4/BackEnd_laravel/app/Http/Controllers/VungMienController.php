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

    public function show($id)
    {
        $vungMien = VungMien::find($id);

        if (!$vungMien) {
            return response()->json(['message' => 'Không tìm thấy vùng miền'], 404);
        }

        // Trả về dữ liệu object JSON để React điền vào ô input
        return response()->json($vungMien, 200);
    }

    public function update(Request $request, $id)
{
    // 1. Tìm vùng miền cần update
    $vungMien = VungMien::find($id);

    if (!$vungMien) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy vùng miền'
        ], 404);
    }

    // 2. Validate dữ liệu
    $validator = Validator::make($request->all(), [
        'ten_vung_mien' => 'required|string|max:255|unique:vung_mien,ten_vung_mien,' . $id . ',ma_vung_mien',
        // ☝️ Cho phép trùng tên với chính bản ghi đang sửa
        'mo_ta' => 'nullable|string'
    ], [
        'ten_vung_mien.required' => 'Tên vùng không được để trống',
        'ten_vung_mien.unique' => 'Tên vùng này đã tồn tại',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => false,
            'message' => 'Lỗi dữ liệu đầu vào',
            'errors' => $validator->errors()
        ], 422);
    }

    // 3. Cập nhật
    try {
        $vungMien->update([
            'ten_vung_mien' => $request->ten_vung_mien,
            'mo_ta' => $request->mo_ta
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật vùng miền thành công',
            'data' => $vungMien
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Lỗi khi cập nhật: ' . $e->getMessage()
        ], 500);
    }
}

    public function store(Request $request)
    {
        // Validate dữ liệu
        $validator = Validator::make($request->all(), [
            'ten_vung_mien' => 'required|string|max:255|unique:vung_mien,ten_vung_mien',
            'mo_ta'         => 'nullable|string'
        ], [
            'ten_vung_mien.required' => 'Tên vùng không được để trống',
            'ten_vung_mien.unique'   => 'Tên vùng này đã tồn tại',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi dữ liệu đầu vào',
                'errors' => $validator->errors()
            ], 422);
        }

        // Tạo mới
        $vungMien = VungMien::create([
            'ten_vung_mien' => $request->ten_vung_mien,
            'mo_ta'         => $request->mo_ta
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Thêm vùng miền thành công',
            'data' => $vungMien
        ], 201);
    }

    public function destroy($id)
{
    // 1. Tìm vùng miền theo ID
    $vungMien = VungMien::find($id);

    // 2. Kiểm tra nếu không tồn tại
    if (!$vungMien) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy vùng miền cần xóa'
        ], 404);
    }

    // 3. (Quan trọng) Kiểm tra xem có Công thức nào đang dùng vùng miền này không?
    // Nếu xóa vùng miền mà các món ăn vẫn trỏ tới nó thì sẽ lỗi dữ liệu.
    // Giả sử model VungMien có quan hệ hasMany('congThuc')
    // $count = $vungMien->congThuc()->count(); 
    // if ($count > 0) {
    //     return response()->json(['status' => false, 'message' => 'Vùng này đang có món ăn, không thể xóa!'], 400);
    // }

    // 4. Thực hiện xóa
    try {
        $vungMien->delete();
        return response()->json([
            'status' => true,
            'message' => 'Xóa vùng miền thành công'
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Lỗi khi xóa: ' . $e->getMessage()
        ], 500);
    }
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
}
