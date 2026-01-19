<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NguyenLieu; 
use Illuminate\Support\Facades\Validator;

class NguyenLieuController extends Controller
{
    public function index(Request $request)
    {
        $nguyenLieu = NguyenLieu::all();
        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách nguyên liệu thành công',
            'data' => $nguyenLieu
        ], 200);
    }

    public function store(Request $request)
    {
        // 1. Validate dữ liệu
        $validator = Validator::make($request->all(), [
            'ten_nguyen_lieu'  => 'required|string|max:255|unique:nguyen_lieu,ten_nguyen_lieu',
            'loai_nguyen_lieu' => 'required|string|max:100', 
            'hinh_anh'         => 'nullable|string' 
        ], [
            'ten_nguyen_lieu.required'  => 'Tên nguyên liệu không được để trống',
            'ten_nguyen_lieu.unique'    => 'Nguyên liệu này đã có trong hệ thống',
            'loai_nguyen_lieu.required' => 'Phải phân loại nguyên liệu (Ví dụ: Thịt, Rau...)',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => false,
                'message' => 'Lỗi dữ liệu đầu vào',
                'errors'  => $validator->errors()
            ], 422);
        }

        // 2. Tạo mới nguyên liệu
        $nguyenLieu = NguyenLieu::create([
            'ten_nguyen_lieu'  => $request->ten_nguyen_lieu,
            'loai_nguyen_lieu' => $request->loai_nguyen_lieu,
            'hinh_anh'         => $request->hinh_anh
        ]);

        // 3. Trả về kết quả
        return response()->json([
            'status'  => true,
            'message' => 'Thêm nguyên liệu thành công',
            'data'    => $nguyenLieu
        ], 201);
    }
}