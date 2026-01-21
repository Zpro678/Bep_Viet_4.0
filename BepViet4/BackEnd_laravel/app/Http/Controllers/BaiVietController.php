<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Exceptions\ForbiddenException;
use App\Models\BaiViet;

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
        $validator = Validator::make($request->all(), [
            'tieu_de' => 'required|string|max:255',
            'noi_dung' => 'required|string',
            'hinh_anh_dai_dien' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $post = BaiViet::taoBaiViet(
                $request->user(),
                $validator->validated()
            );

            return response()->json([
                'status' => true,
                'message' => 'Tạo bài viết thành công',
                'data' => $post
            ], 201);
        } catch (ForbiddenException $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 403);
        }
    }

    // ===== 26. PUT /posts/{id} =====
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'tieu_de' => 'sometimes|required|string|max:255',
            'noi_dung' => 'sometimes|required|string',
            'hinh_anh_dai_dien' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $post = BaiViet::capNhatBaiViet(
                $id,
                $request->user(),
                $validator->validated()
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