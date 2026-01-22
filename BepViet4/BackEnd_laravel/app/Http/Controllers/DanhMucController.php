<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\DanhMuc; 

class DanhMucController extends Controller
{
    public function index()
    {
        // Lấy tất cả danh mục
        // Nếu muốn sắp xếp theo tên thì dùng: DanhMuc::orderBy('ten_danh_muc', 'asc')->get();
        $listDanhMuc = DanhMuc::all();

        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách danh mục thành công',
            'data' => $listDanhMuc
        ], 200);
    }

    public function show($id)
    {
        $danhMuc = DanhMuc::find($id);

        if (!$danhMuc) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy danh mục'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Lấy thông tin danh mục thành công',
            'data' => $danhMuc
        ], 200);
    }

    public function store(Request $request)
    {
        // 1. Kiểm tra quyền Admin (Placeholder)
        // Sau này bạn sẽ dùng Middleware hoặc check: if ($request->user()->role !== 'admin') ...
        
        // 2. Validate dữ liệu
        $validator = Validator::make($request->all(), [
            'ten_danh_muc' => 'required|string|max:255|unique:danh_muc,ten_danh_muc',
            'mo_ta'        => 'nullable|string'
        ], [
            'ten_danh_muc.required' => 'Tên danh mục không được để trống',
            'ten_danh_muc.unique'   => 'Tên danh mục này đã tồn tại',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => false,
                'message' => 'Lỗi dữ liệu đầu vào',
                'errors'  => $validator->errors()
            ], 422);
        }

        // 3. Tạo danh mục mới
        // Vì Model đã khai báo $fillable nên dùng create() cho nhanh
        $danhMuc = DanhMuc::create([
            'ten_danh_muc' => $request->ten_danh_muc,
            'mo_ta'        => $request->mo_ta
        ]);

        // 4. Trả về kết quả
        return response()->json([
            'status'  => true,
            'message' => 'Tạo danh mục thành công',
            'data'    => $danhMuc
        ], 201); 
    }

    public function update(Request $request, $id)
    {
        // 1. Tìm danh mục theo ID
        $danhMuc = DanhMuc::find($id);

        if (!$danhMuc) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy danh mục'
            ], 404);
        }

        // 2. Validate dữ liệu
        // Cú pháp unique: table,column,except_id,id_column
        // Nghĩa là: Kiểm tra trùng tên trong bảng danh_muc, TRỪ dòng có ma_danh_muc = $id hiện tại
        $validator = Validator::make($request->all(), [
            'ten_danh_muc' => 'required|string|max:255|unique:danh_muc,ten_danh_muc,' . $id . ',ma_danh_muc', 
            'mo_ta'        => 'nullable|string'
        ], [
            'ten_danh_muc.required' => 'Tên danh mục không được để trống',
            'ten_danh_muc.unique'   => 'Tên danh mục này đã tồn tại ở một mục khác',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => false,
                'message' => 'Lỗi dữ liệu đầu vào',
                'errors'  => $validator->errors()
            ], 422);
        }

        // 3. Cập nhật dữ liệu
        $danhMuc->update([
            'ten_danh_muc' => $request->ten_danh_muc,
            'mo_ta'        => $request->mo_ta
        ]);

        // 4. Trả về kết quả
        return response()->json([
            'status'  => true,
            'message' => 'Cập nhật danh mục thành công',
            'data'    => $danhMuc
        ], 200);
    }
    public function destroy($id)
    {
        // 1. Tìm danh mục
        $danhMuc = DanhMuc::find($id);

        if (!$danhMuc) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy danh mục'
            ], 404);
        }

        // 2. (Tùy chọn) Kiểm tra xem có bài viết/công thức nào thuộc danh mục này không?
        // Nếu có thì chặn không cho xóa để tránh lỗi dữ liệu.
        // Giả sử model DanhMuc có quan hệ hasMany với model CongThuc
        /*
        $count = $danhMuc->congThuc()->count();
        if ($count > 0) {
            return response()->json([
                'status' => false, 
                'message' => 'Danh mục này đang chứa ' . $count . ' công thức, không thể xóa!'
            ], 400);
        }
        */

        // 3. Thực hiện xóa
        try {
            $danhMuc->delete();
            return response()->json([
                'status' => true,
                'message' => 'Xóa danh mục thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi hệ thống: ' . $e->getMessage()
            ], 500);
        }
    }
}