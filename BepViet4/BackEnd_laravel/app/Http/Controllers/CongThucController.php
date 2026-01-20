<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Exceptions\ForbiddenException;
use App\Models\NguoiDung;
use App\Models\CongThuc;
use Illuminate\Support\Facades\DB;
use App\Models\BaiViet;
// use Illuminate\Validation\Validator;

class CongThucController extends Controller
{
    // ========================= Lấy danh sách công thức của người dùng theo id ===================================
    public function getDanhSachCongThuc($id)
    {
        // kiểm tra người dùng tồn tại
        $user = NguoiDung::where('ma_nguoi_dung', $id)->first();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Người dùng không tồn tại'], 404);
        }

       
        $recipes = CongThuc::where('ma_nguoi_dung', $id)
            ->with(['hinhAnh' => function ($query) {
                // Sau khi lấy tất cả công thức thì sẽ lấy hình ảnh tương ứng với mỗi công thức
                $query->select('ma_cong_thuc', 'duong_dan');
            }])
            ->select('ma_cong_thuc', 'ten_mon', 'mo_ta', 'thoi_gian_nau', 'do_kho', 'ngay_tao') 
            ->orderBy('ngay_tao', 'desc')
            ->paginate(10); // Phân trang

        //Xử lý dữ liệu và lấy 1 ảnh đại diện
        $recipes->getCollection()->transform(function ($recipe) {
            return [
                'id' => $recipe->ma_cong_thuc,
                'ten_mon' => $recipe->ten_mon,
                'mo_ta_ngan' => $recipe->mo_ta,
                'thoi_gian' => $recipe->thoi_gian_nau . ' phút',
                'do_kho' => $recipe->do_kho . '/5',
                'hinh_anh' => $recipe->hinhAnh->first() ? $recipe->hinhAnh->first()->duong_dan : 'default_image_url.jpg',
                'ngay_dang' => $recipe->ngay_tao,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $recipes
        ], 200);
    }

    // ========================= Lấy bảng tin (news feed) cho người dùng theo dõi ===================================
    public function getNewsFeed(Request $request)
    {
        
        $currentUser = $request->user();
        $followingIds = $currentUser->dangTheoDoi()->pluck('nguoi_dung.ma_nguoi_dung')->toArray();
        $idsString = !empty($followingIds) ? implode(',', $followingIds) : '0';
    
        $recipesQuery = DB::table('cong_thuc')
            ->select(
                'ma_cong_thuc as id', 
                'ma_nguoi_dung', 
                'created_at', 
                DB::raw('"CongThuc" as type')
            )
            ->where('ma_nguoi_dung', '!=', $currentUser->ma_nguoi_dung);
 
        $postsQuery = DB::table('bai_viet')
            ->select(
                'ma_bai_viet as id', 
                'ma_nguoi_dung', 
                'created_at', 
                DB::raw('"BaiViet" as type') 
            )
            ->where('ma_nguoi_dung', '!=', $currentUser->ma_nguoi_dung);
    
      
        $combinedQuery = $recipesQuery->union($postsQuery)
            ->orderByRaw("CASE WHEN ma_nguoi_dung IN ($idsString) THEN 1 ELSE 0 END DESC") 
            ->orderBy('created_at', 'desc');
    
        $paginatedFeed = $combinedQuery->paginate(10);
    
        $paginatedFeed->getCollection()->transform(function ($item) use ($currentUser) {
            
            if ($item->type === 'CongThuc') {
            
                $fullData = CongThuc::with('nguoiTao')
                    ->withCount('luotThich') // Đếm like
                    ->find($item->id);
                    
                if ($fullData) {
                     $fullData->is_liked = $fullData->luotThich()
                         ->where('ma_nguoi_dung', $currentUser->ma_nguoi_dung)
                         ->exists();
                     $fullData->type = 'CongThuc'; // Gán lại type để Frontend biết
                }
                return $fullData;
                
            } else {
              
                $fullData = BaiViet::with('nguoiTao')
                    ->withCount('luotThich')
                    ->find($item->id);
                    
                if ($fullData) {
                     $fullData->is_liked = $fullData->luotThich()
                         ->where('ma_nguoi_dung', $currentUser->ma_nguoi_dung)
                         ->exists();
                     $fullData->type = 'BaiViet';
                }
                return $fullData;
            }
        });
    
        // Lọc bỏ các item null (trường hợp hiếm hoi ID có trong index nhưng bị xóa trong bảng thật)
        $cleanData = $paginatedFeed->getCollection()->filter()->values();
        $paginatedFeed->setCollection($cleanData);
    
        return response()->json([
            'status' => 'success',
            'data' => $paginatedFeed
        ]);
}

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
