<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Exceptions\ForbiddenException;
use App\Models\BaiViet;
use App\Models\HinhAnhBaiViet; 
use Illuminate\Support\Facades\Storage; 

class BaiVietController extends Controller
{
    // 23. GET /posts
    public function index(Request $request)
    {
        $filters = $request->validate([
            'keyword' => 'nullable|string|max:255'
        ]);

        $posts = BaiViet::danhSach($filters);

        return response()->json([
            'status' => true,
            'message' => 'Danh sách bài viết',
            'data' => $posts
        ]);
    }

    // 25. GET /posts/{id}
    public function show($id)
    {
        try {
            $post = BaiViet::chiTiet($id);

            return response()->json([
                'status' => true,
                'message' => 'Chi tiết bài viết',
                'data' => $post
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Bài viết không tồn tại'
            ], 404);
        }
    }

    // 24. POST /posts:
    public function store(Request $request)
    {
        // 1. Validate
        $validator = Validator::make($request->all(), [
            'tieu_de' => 'required|string|max:255',
            'noi_dung' => 'required|string',
            // Validate mảng hinh_anh
            'hinh_anh' => 'nullable|array', 
            'hinh_anh.*' => 'image|mimes:jpeg,png,jpg,webp|max:10240', // Max 10MB mỗi ảnh
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            // 2. Tạo bài viết gốc trước
            $post = BaiViet::taoBaiViet($request->user(), [
                'tieu_de' => $request->tieu_de,
                'noi_dung' => $request->noi_dung,
                'hinh_anh_dai_dien' => null // Sẽ cập nhật sau
            ]);

            // 3. Xử lý lưu nhiều ảnh vào bảng hinh_anh_bai_viet
            if ($request->hasFile('hinh_anh')) {
                $images = $request->file('hinh_anh');
                
                foreach($images as $index => $file) {
                    // Lưu file vào storage
                    $path = $file->store('posts', 'public');
                    $fullPath = '/storage/' . $path;

                    // Lưu vào DB bảng phụ
                    HinhAnhBaiViet::create([
                        'ma_bai_viet' => $post->ma_bai_viet,
                        'duong_dan' => $fullPath,
                        'mo_ta' => 'Ảnh số ' . ($index + 1)
                    ]);

                    // (Tùy chọn) Cập nhật ảnh đại diện là ảnh đầu tiên để hiển thị thumbnail ở nơi khác
                    if ($index === 0) {
                        $post->hinh_anh_dai_dien = $fullPath;
                        $post->save();
                    }
                }
            }

            // Load lại quan hệ hình ảnh để trả về Frontend ngay lập tức
            $post->load('hinhAnh');

            return response()->json([
                'status' => true,
                'message' => 'Đăng bài thành công',
                'data' => $post
            ], 201);

        } catch (\Exception $e) {
             return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ===== 26. PUT /posts/{id} =====
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'tieu_de' => 'sometimes|required|string|max:255',
            'noi_dung' => 'sometimes|required|string',
            'hinh_anh_dai_dien' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120' // Max 5MB, không có gif
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();

            // 2. Xử lý lưu file ảnh cập nhật (Logic thêm mới)
            if ($request->hasFile('hinh_anh_dai_dien')) {
                $path = $request->file('hinh_anh_dai_dien')->store('posts', 'public');
                $data['hinh_anh_dai_dien'] = '/storage/' . $path;
            }

            $post = BaiViet::capNhatBaiViet(
                $id,
                $request->user(),
                $data
            );

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật bài viết thành công',
                'data' => $post
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Bài viết không tồn tại'
            ], 404);
        } catch (ForbiddenException $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 403);
        }
    }

    // ===== 27. DELETE /posts/{id} =====
    public function destroy(Request $request, $id)
    {
        try {
            BaiViet::xoaBaiViet($id, $request->user());

            return response()->json([
                'status' => true,
                'message' => 'Xóa bài viết thành công'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Bài viết không tồn tại'
            ], 404);
        } catch (ForbiddenException $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 403);
        }
    }
}