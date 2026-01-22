<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Exceptions\ForbiddenException;
use App\Models\BaiViet;
use App\Models\HinhAnhBaiViet; 
use Illuminate\Support\Facades\Storage; 
use App\Models\NguoiDung;

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
            'tieu_de' => 'nullable|string|max:255',
            'noi_dung' => 'nullable|string',
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
                // 'hinh_anh_dai_dien' => null // Sẽ cập nhật sau
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
            'tieu_de' => 'sometimes|nullable|string|max:255',
            'noi_dung' => 'sometimes|nullable|string',
            'hinh_anh' => 'nullable|array',
            'hinh_anh.*' => 'image|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $post = BaiViet::findOrFail($id);

            // Kiểm tra quyền chủ sở hữu
            if ($post->ma_nguoi_dung != $request->user()->ma_nguoi_dung) {
                return response()->json(['status' => false, 'message' => 'Bạn không có quyền sửa'], 403);
            }

            // Cập nhật text
            $post->update($request->only(['tieu_de', 'noi_dung']));

            // Xử lý ảnh mới nếu có gửi lên
            if ($request->hasFile('hinh_anh')) {
                $images = $request->file('hinh_anh');
                foreach($images as $index => $file) {
                    $path = $file->store('posts', 'public');
                    $fullPath = '/storage/' . $path;

                    HinhAnhBaiViet::create([
                        'ma_bai_viet' => $post->ma_bai_viet,
                        'duong_dan' => $fullPath,
                        'mo_ta' => 'Ảnh cập nhật'
                    ]);

                    // Nếu chưa có ảnh đại diện thì lấy ảnh đầu tiên mới up làm đại diện
                    if (!$post->hinh_anh_dai_dien) {
                        $post->hinh_anh_dai_dien = $fullPath;
                        $post->save();
                    }
                }
            }

            $post->load('hinhAnh'); // Load lại danh sách ảnh mới nhất

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật thành công',
                'data' => $post
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
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


    // lấy danh sách bài viết của 1 member
    public function getDanhSachBaiViet($id)
    {
        // Kiểm tra người dùng tồn tại
        $user = NguoiDung::where('ma_nguoi_dung', $id)->first();
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Người dùng không tồn tại'
            ], 404);
        }

        // Lấy danh sách bài viết của người dùng
        $posts = BaiViet::where('ma_nguoi_dung', $id)
            ->with([
                'nguoiDung:ma_nguoi_dung,ho_ten',
                'hinhAnh:ma_bai_viet,duong_dan'
            ])
            ->select(
                'ma_bai_viet',
                'ma_nguoi_dung',
                'tieu_de',
                'noi_dung',
                'hinh_anh_dai_dien',
                'ngay_dang',
                'luot_yeu_thich',
                'luot_chia_se'
            )
            ->orderBy('ngay_dang', 'desc')
            ->paginate(10);

        // Transform dữ liệu cho frontend
        $posts->getCollection()->transform(function ($post) {
            return [
                'id' => $post->ma_bai_viet,
                'tieu_de' => $post->tieu_de,
                'noi_dung' => $post->noi_dung,
                'hinh_anh' => $post->hinh_anh_dai_dien
                    ? $post->hinh_anh_dai_dien
                    : ($post->hinhAnh->first()->duong_dan ?? null),
                'luot_yeu_thich' => $post->luot_yeu_thich,
                'luot_chia_se' => $post->luot_chia_se,
                'ngay_dang' => $post->ngay_dang,
                'nguoi_dung' => [
                    'id' => $post->nguoiDung->ma_nguoi_dung,
                    'ho_ten' => $post->nguoiDung->ho_ten,
                ]
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $posts
        ], 200);
    }
}

