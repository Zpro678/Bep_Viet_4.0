<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Exceptions\ForbiddenException;
use App\Models\CongThuc;

class CongThucController extends Controller
{
    // DS
    public function index(Request $request)
    {
        $filter = [
            'ten'     => $request->query('ten'),      // tên món
            'do_kho'  => $request->query('do_kho'),   // độ khó
        ];

        $recipes = CongThuc::with([
            'tacGia:ma_nguoi_dung,ten_nguoi_dung',
            'danhMuc:ma_danh_muc,ten_danh_muc',
            'vungMien:ma_vung_mien,ten_vung_mien'
        ])
            ->when($filter['ten'], function ($q, $v) {
                $q->where('ten_mon', 'like', "%$v%");
            })
            ->when($filter['do_kho'], function ($q, $v) {
                $q->where('do_kho', $v);
            })
            ->orderByDesc('ngay_tao')
            ->paginate(10);

        return response()->json([
            'status' => true,
            'message' => 'Danh sách công thức',
            'data' => $recipes
        ]);
    }

    // TẠO CT MỚI
    public function store(Request $request)
    {
        // VALIDATE LẠI
        $validator = Validator::make($request->all(), [
            'ten_mon'       => 'required|string|max:255',
            'mo_ta'         => 'nullable|string',
            'ma_danh_muc'   => 'required|integer|exists:danh_muc,ma_danh_muc',
            'ma_vung_mien'  => 'required|integer|exists:vung_mien,ma_vung_mien',
            'thoi_gian_nau' => 'required|integer|min:1',
            'khau_phan'     => 'required|integer|min:1',
            'do_kho'        => 'required|integer|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $userId = $request->user()->ma_nguoi_dung;

        $congThuc = CongThuc::taoCongThuc($userId, $validator->validated());

        return response()->json([
            'status' => true,
            'message' => 'Tạo công thức thành công',
            'data' => $congThuc
        ], 201);
    }

    //    15. GET /recipes/{id}
    public function show($id)
    {
        try {
            $recipe = CongThuc::getDetailBasic((int)$id);

            return response()->json([
                'status' => true, // trả về boolean để dễ parse ở React
                'message' => 'Lấy chi tiết công thức thành công',
                'data' => $recipe
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Công thức không tồn tại'
            ], 404);
        }
    }


    //    16. GET /recipes/{id}/detail-full
    public function showFull($id)
    {
        try {
            $recipe = CongThuc::getDetailFull($id);

            return response()->json([
                'status' => true,
                'message' => 'Lấy chi tiết đầy đủ công thức thành công',
                'data' => $recipe
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Công thức không tồn tại'
            ], 404);
        }
    }

    //    19. GET /recipes/popular
    public function popular(Request $request)
    {
        $limit = $request->get('limit', 10);

        $recipes = CongThuc::getPopular($limit);

        return response()->json([
            'status' => 'success',
            'message' => 'Danh sách công thức phổ biến',
            'data' => $recipes
        ]);
    }

    //    20. GET /recipes/search
    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'keyword' => 'nullable|string|max:255',
            'ma_danh_muc' => 'nullable|integer|exists:danh_muc,ma_danh_muc',
            'ma_vung_mien' => 'nullable|integer|exists:vung_mien,ma_vung_mien',
            'do_kho' => 'nullable|integer|min:1|max:5',
            'page' => 'nullable|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Tham số tìm kiếm không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $filters = $validator->validated();

        $result = CongThuc::searchAdvanced($filters);

        return response()->json([
            'status' => true,
            'message' => 'Kết quả tìm kiếm công thức',
            'data' => $result
        ]);
    }

    // 17. PUT /recipes/{id}: 
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'ten_mon' => 'sometimes|required|string|max:255',
            'mo_ta' => 'nullable|string',
            'thoi_gian_nau' => 'sometimes|required|integer|min:1',
            'khau_phan' => 'sometimes|required|integer|min:1',
            'do_kho' => 'sometimes|required|integer|min:1|max:5',
            'ma_vung_mien' => 'sometimes|required|integer|exists:vung_mien,ma_vung_mien'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu cập nhật không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $userId = $request->user()->ma_nguoi_dung;

            $congThuc = CongThuc::capNhatCongThuc(
                $id,
                $userId,
                $validator->validated()
            );

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật công thức thành công',
                'data' => $congThuc
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Công thức không tồn tại'
            ], 404);
        } catch (ForbiddenException $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 403);
        }
    }

    // 18. DELETE /recipes/{id}:
    public function destroy(Request $request, $id)
    {
        try {
            $userId = $request->user()->ma_nguoi_dung;

            CongThuc::xoaCongThuc($id, $userId);

            return response()->json([
                'status' => true,
                'message' => 'Xóa công thức thành công'
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Công thức không tồn tại'
            ], 404);
        } catch (ForbiddenException $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 403);
        }
    }

    // 21. POST /recipes/{id}/ingredients:
    public function syncIngredients(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'ingredients' => 'required|array|min:1',
            'ingredients.*.ma_nguyen_lieu' => 'required|integer|exists:nguyen_lieu,ma_nguyen_lieu',
            'ingredients.*.dinh_luong' => 'required|numeric|min:0.01',
            'ingredients.*.don_vi_tinh' => 'required|string|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Danh sách nguyên liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $userId = $request->user()->ma_nguoi_dung;

            // chuẩn hóa dữ liệu cho sync()
            $syncData = [];
            foreach ($request->ingredients as $item) {
                $syncData[$item['ma_nguyen_lieu']] = [
                    'dinh_luong' => $item['dinh_luong'],
                    'don_vi_tinh' => $item['don_vi_tinh']
                ];
            }

            // sau khi sync ko có nguyên liệu:
            if (empty($syncData)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Công thức phải có ít nhất 1 nguyên liệu'
                ], 422);
            }


            $congThuc = CongThuc::dongBoNguyenLieu(
                $id,
                $userId,
                $syncData
            );

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật nguyên liệu thành công',
                'data' => $congThuc
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Công thức không tồn tại'
            ], 404);
        } catch (ForbiddenException $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 403);
        }
    }

    // 22. POST /recipes/{id}/categories:
    public function updateCategory(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'ma_danh_muc' => 'required|integer|exists:danh_muc,ma_danh_muc'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Danh mục không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $userId = $request->user()->ma_nguoi_dung;

            $congThuc = CongThuc::capNhatDanhMuc(
                $id,
                $userId,
                $request->ma_danh_muc
            );

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật danh mục thành công',
                'data' => $congThuc
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Công thức không tồn tại'
            ], 404);
        } catch (ForbiddenException $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 403);
        }
    }
}
