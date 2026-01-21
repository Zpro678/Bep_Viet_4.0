<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\NguoiDung;
use App\Models\CongThuc;
use Illuminate\Support\Facades\DB;
use App\Models\BaiViet;
use App\Models\NguyenLieu;
use App\Models\The;
use App\Models\VideoHuongDan;
use App\Models\HinhAnhCongThuc;
use App\Models\BuocThucHien;
use App\Models\HinhAnhBuoc;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\Access\AuthorizationException as ForbiddenException;
class CongThucController extends Controller
{
    // ========================= Lấy danh sách công thức của người dùng theo id ===================================
    public function getDanhSachCongThuc(Request $request, $id)
    {
        // 1. Kiểm tra user tồn tại
        $userToCheck = NguoiDung::where('ma_nguoi_dung', $id)->first();
        if (!$userToCheck) {
            return response()->json(['status' => 'error', 'message' => 'Người dùng không tồn tại'], 404);
        }

        // 2. Khởi tạo Query
        $query = CongThuc::where('ma_nguoi_dung', $id);

        // 3. Kiểm tra người xem
        $currentUserId = $request->user('sanctum')
            ? $request->user('sanctum')->ma_nguoi_dung
            : null;
    
        if ($currentUserId != $id) {
            $query->where('trang_thai', 'cong_khai');
        }
    
       
        $query->whereExists(function ($q) {
            $q->select(DB::raw(1))
              ->from('hinh_anh_cong_thuc as hinh_anh')
              ->whereColumn('hinh_anh.ma_cong_thuc', 'cong_thuc.ma_cong_thuc');
        });
    
        // 4. Query + eager loading 
        $recipes = $query
            ->with(['hinhAnh' => function ($q) {
                $q->select('ma_cong_thuc', 'duong_dan');
            }])
            ->select(
                'ma_cong_thuc',
                'ten_mon',
                'mo_ta',
                'trang_thai',
                'thoi_gian_nau',
                'do_kho',
                'ngay_tao'
            );


        // 3. Kiểm tra người xem có phải là chủ sở hữu không  
        $currentUserId = $request->user('sanctum') ? $request->user('sanctum')->ma_nguoi_dung : null;

        // Nếu người xem KHÔNG PHẢI là chủ sở hữu -> Chỉ hiện bài đã duyệt (công khai)
        if ($currentUserId != $id) {
            $query->where('trang_thai', 'cong_khai');
        }

        // 4. Thực hiện query và eager loading 
        $recipes = $query->with([
            'hinhAnh' => function ($q) {
                $q->select('ma_cong_thuc', 'duong_dan');
            }
        ])
            ->select('ma_cong_thuc', 'ten_mon', 'mo_ta', 'trang_thai', 'thoi_gian_nau', 'do_kho', 'ngay_tao')
            ->orderBy('ngay_tao', 'desc')
            ->paginate(10);

        // 5. Transform dữ liệu 
        $recipes->getCollection()->transform(function ($recipe) {
            return [
                'id' => $recipe->ma_cong_thuc,
                'ten_mon' => $recipe->ten_mon,
                'mo_ta_ngan' => $recipe->mo_ta,
                'trang_thai' => $recipe->trang_thai,
                'thoi_gian' => $recipe->thoi_gian_nau . ' phút',
                'do_kho' => $recipe->do_kho . '/5',
                'hinh_anh' => $recipe->hinhAnh->first()
                    ? $recipe->hinhAnh->first()->duong_dan
                    : 'default.jpg',
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

        // Lấy danh sách ID người đang theo dõi
        $followingIds = $currentUser->dangTheoDoi()->pluck('nguoi_dung.ma_nguoi_dung')->toArray();
        $idsString = !empty($followingIds) ? implode(',', $followingIds) : '0';


        $recipesQuery = DB::table('cong_thuc')
            ->select(
                'ma_cong_thuc as id',
                'ma_nguoi_dung',
                'created_at',
                DB::raw('"CongThuc" as type')
            )
            ->where('ma_nguoi_dung', '!=', $currentUser->ma_nguoi_dung)
            ->where('trang_thai', 'cong_khai');


        $postsQuery = DB::table('bai_viet')
            ->select(
                'ma_bai_viet as id',
                'ma_nguoi_dung',
                'created_at',
                DB::raw('"BaiViet" as type')
            )
            ->where('ma_nguoi_dung', '!=', $currentUser->ma_nguoi_dung);
        // ->where('trang_thai', 'cong_khai');

        // Union và Sắp xếp 
        $combinedQuery = $recipesQuery->union($postsQuery)
            ->orderByRaw("CASE WHEN ma_nguoi_dung IN ($idsString) THEN 1 ELSE 0 END DESC")
            ->orderBy('created_at', 'desc');

        $paginatedFeed = $combinedQuery->paginate(10);

        // Transform dữ liệu
        $paginatedFeed->getCollection()->transform(function ($item) use ($currentUser) {
            if ($item->type === 'CongThuc') {

                // Lấy chi tiết công thức
                $fullData = CongThuc::with('nguoiTao')
                    ->withCount('luotThich')
                    ->where('trang_thai', 'cong_khai')
                    ->find($item->id);

                if ($fullData) {
                    $fullData->is_liked = $fullData->luotThich()
                        ->where('ma_nguoi_dung', $currentUser->ma_nguoi_dung)
                        ->exists();
                    $fullData->type = 'CongThuc';

                    // Clean up output (chỉ lấy hình đầu tiên )
                    $fullData->hinh_anh_dau_tien = $fullData->hinhAnh->first() ? $fullData->hinhAnh->first()->duong_dan : null;
                    unset($fullData->hinhAnh); // Xóa mảng hình ảnh gốc cho gọn JSON
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


        $cleanData = $paginatedFeed->getCollection()->filter()->values();
        $paginatedFeed->setCollection($cleanData);

        return response()->json([
            'status' => 'success',
            'data' => $paginatedFeed
        ]);
    }

    public function store(Request $request)
    {

        // 1. Validate dữ liệu (Nên tách ra Request riêng như bài trước, ở đây viết gọn)
        // Lưu ý: Validate mảng và file upload khá phức tạp
        $request->validate([
            'ten_mon' => 'required|string|max:255',
            'ma_danh_muc' => 'required|exists:danh_muc,ma_danh_muc',
            'thoi_gian_nau' => 'required|integer|min:1',
            'khau_phan' => 'required|integer|min:1',
            'do_kho' => 'required|integer|between:1,5',
            'hinh_anh_bia' => 'nullable|image|max:5120',

            // Validate mảng nguyên liệu
            'nguyen_lieu' => 'required|array',
            'nguyen_lieu.*.ten_nguyen_lieu' => 'required|string',
            'nguyen_lieu.*.dinh_luong' => 'required|numeric',
            'nguyen_lieu.*.don_vi_tinh' => 'required|string',

            // Validate mảng các bước
            'cac_buoc' => 'required|array',
            'cac_buoc.*.noi_dung' => 'required|string',

            // Validate tags
            'tags' => 'nullable|array'
        ]);

        // BẮT ĐẦU TRANSACTION (Quan trọng: Lỗi 1 chỗ là hoàn tác tất cả)
        DB::beginTransaction();

        try {
            $user = $request->user(); // Lấy user từ Token

            // --- BƯỚC 1: TẠO CÔNG THỨC CHÍNH ---
            $congThuc = CongThuc::create([
                'ma_nguoi_dung' => $user->ma_nguoi_dung,
                'ma_danh_muc' => $request->ma_danh_muc,
                'ma_vung_mien' => $request->ma_vung_mien, // Có thể null
                'ten_mon' => $request->ten_mon,
                'mo_ta' => $request->mo_ta,
                'trang_thai' => 'cho_duyet',
                'thoi_gian_nau' => $request->thoi_gian_nau,
                'khau_phan' => $request->khau_phan,
                'do_kho' => $request->do_kho,
                'ngay_tao' => now(),
            ]);

            // --- BƯỚC 2: XỬ LÝ ẢNH BÌA (Bảng hinh_anh_cong_thuc) ---
            if ($request->hasFile('hinh_anh_bia')) {
                $path = $request->file('hinh_anh_bia')->store('recipes/covers', 'public');
                HinhAnhCongThuc::create([
                    'ma_cong_thuc' => $congThuc->ma_cong_thuc,
                    'duong_dan' => $path,
                    'mo_ta' => 'Ảnh bìa chính'
                ]);
            }

            // --- BƯỚC 3: XỬ LÝ VIDEO (Bảng video_huong_dan) ---
            if ($request->filled('video_url')) {

                // 1. Tự động xác định nền tảng (Youtube, Tiktok hay cái gì đó)
                $url = $request->video_url;
                $nenTang = 'Khác';

                if (str_contains($url, 'youtube') || str_contains($url, 'youtu.be')) {
                    $nenTang = 'Youtube';
                } elseif (str_contains($url, 'tiktok')) {
                    $nenTang = 'Tiktok';
                } else {
                    $nenTang = 'Website';
                }

                // 2. Lưu vào Database 
                VideoHuongDan::create([
                    'ma_cong_thuc' => $congThuc->ma_cong_thuc, // ID món ăn
                    'tieu_de_video' => 'Video hướng dẫn làm ' . $congThuc->ten_mon,
                    'duong_dan_video' => $url,           // Lấy từ request gửi lên
                    'nen_tang' => $nenTang,       // Youtube/Tiktok...
                    'la_video_chinh' => 1,              // Mặc định video upload lúc tạo là video chính
                    'thoi_luong' => null            // Vì chỉ có link nên chưa biết thời lượng, để null
                ]);
            }

            // --- BƯỚC 4: XỬ LÝ TAGS (Bảng trung gian cong_thuc_the) ---
            if ($request->filled('tags')) {
                $tagIds = [];
                foreach ($request->tags as $tagName) {
                    // Logic: Tìm thẻ theo tên, nếu chưa có thì tạo mới
                    $tag = The::firstOrCreate(
                        ['ten_the' => trim($tagName)],
                        // Nếu tạo mới thì thêm slug hoặc thuộc tính khác
                        ['slug' => Str::slug($tagName)]
                    );
                    $tagIds[] = $tag->ma_the;
                }
                $congThuc->the()->attach($tagIds);
            }

            // --- BƯỚC 5: XỬ LÝ NGUYÊN LIỆU (Bảng trung gian cong_thuc_nguyen_lieu) ---
            // Dữ liệu client gửi lên: [{ ten_nguyen_lieu: "Thịt bò", so_luong: 500, don_vi_tinh: "g" }, ...]
            foreach ($request->nguyen_lieu as $nlItem) {
                // 5.1 Tìm hoặc Tạo mới nguyên liệu trong kho
                $nguyenLieu = NguyenLieu::firstOrCreate(
                    ['ten_nguyen_lieu' => trim($nlItem['ten_nguyen_lieu'])],
                    // Nếu cần thêm thuộc tính mặc định cho nguyen lieu moi thì them vao mang thu 2 nay
                    ['loai_nguyen_lieu' => $nlItem['loai_nguyen_lieu'] ?? 'Khác']
                );

                // 5.2 Attach vào bảng trung gian kèm số lượng
                // attach(ID, [các_cột_phụ])
                $congThuc->nguyenLieu()->attach($nguyenLieu->ma_nguyen_lieu, [
                    'dinh_luong' => $nlItem['dinh_luong'],
                    'don_vi_tinh' => $nlItem['don_vi_tinh']
                ]);
            }

            // --- BƯỚC 6: XỬ LÝ CÁC BƯỚC THỰC HIỆN + ẢNH BƯỚC ---
            // Lưu ý: Client cần gửi dạng array object. Nếu có file ảnh trong mảng thì hơi phức tạp với FormData.
            // Giả sử client gửi dạng: cac_buoc[0][noi_dung], cac_buoc[0][hinh_anh] (file)

            if ($request->has('cac_buoc')) {
                foreach ($request->cac_buoc as $index => $stepData) {
                    // 6.1 Tạo bước
                    $buoc = BuocThucHien::create([
                        'ma_cong_thuc' => $congThuc->ma_cong_thuc,
                        'so_thu_tu' => $index + 1, // Tự động tăng thứ tự 1, 2, 3...
                        'noi_dung' => $stepData['noi_dung']
                    ]);

                    // 6.2 Kiểm tra xem bước này có ảnh không
                    // Trong FormData: cac_buoc[0][hinh_anh]
                    // Laravel Request sẽ hứng được file 
                    if (isset($stepData['hinh_anh']) && $request->hasFile("cac_buoc.$index.hinh_anh")) {
                        $files = $request->file("cac_buoc.$index.hinh_anh");

                        // Nếu client gửi 1 file hay nhiều file cho 1 bước
                        if (!is_array($files)) {
                            $files = [$files];
                        }

                        foreach ($files as $file) {
                            $pathStep = $file->store('recipes/steps', 'public');
                            HinhAnhBuoc::create([
                                'ma_buoc' => $buoc->ma_buoc,
                                'duong_dan' => $pathStep,
                                'mo_ta' => 'Ảnh minh họa bước ' . ($index + 1)
                            ]);
                        }
                    }
                }
            }

            // --- HOÀN TẤT ---
            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Công thức đang chờ duyệt!',
                'data' => $congThuc->load('hinhAnh', 'nguyenLieu', 'the', 'cacBuoc.hinhAnhBuoc')
            ], 201);

        } catch (\Exception $e) {
            // CÓ LỖI -> HOÀN TÁC TOÀN BỘ
            DB::rollBack();
            Log::error("Lỗi tạo công thức: " . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Đã xảy ra lỗi hệ thống, vui lòng thử lại.',
                'debug' => $e->getMessage() // Tắt dòng này khi chạy thật (Production)
            ], 500);
        }
    }

    public function index(Request $request)
    {

        // with('nguoiDung'): Kỹ thuật Eager Loading để lấy luôn thông tin người đăng
        // withAvg('danhGia', 'so_sao'): Tính luôn điểm trung bình đánh giá
        $query = CongThuc::with(['nguoiDung:id,ho_ten,anh_dai_dien', 'hinhAnhCongThucs'])
            ->withAvg('danhGia', 'so_sao') // Tạo thêm trường danh_gia_avg_so_sao
            ->where('trang_thai', 'cong_khai'); // Chỉ lấy bài công khai

        // Tìm kiếm theo tên món
        if ($request->has('keyword')) {
            $query->where('ten_mon', 'like', '%' . $request->keyword . '%');
        }

        // Lọc theo Danh mục (VD: Món Chay, Món Mặn)
        if ($request->has('danh_muc_id')) {
            $query->where('danh_muc_id', $request->danh_muc_id);
        }

        // Lọc theo Vùng miền (Bắc, Trung, Nam)
        if ($request->has('vung_mien_id')) {
            $query->where('vung_mien_id', $request->vung_mien_id);
        }

        // 3. Xử lý Sắp xếp 
        // Mặc định là mới nhất
        $sort = $request->input('sort', 'newest');

        switch ($sort) {
            case 'popular':
                // Sắp xếp theo điểm đánh giá cao nhất
                $query->orderByDesc('danh_gia_avg_so_sao');
                break;
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        // 4. Phân trang (Mỗi trang 10 công thức)
        $congThucs = $query->paginate(10);

        // 5. Trả về JSON chuẩn
        return response()->json([
            'status' => 'success',
            'message' => 'Lấy danh sách công thức thành công',
            'data' => $congThucs
        ], 200);
    }
    //    15. GET /recipes/{id}
    public function show($id)
    {
        try {
            $recipe = CongThuc::getDetailBasic((int) $id);

            return response()->json([
                'status' => true, // trả về boolean để dễ parse ở React
                'message' => 'Lấy chi tiết công thức thành công',
                'data' => $recipe
            ]);
        } catch (\Exception $e) {
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
        } catch (\Exception $e) {
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
    //UC-24: Tìm kiếm bài viết ở trang chủ
    public function searchPost(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'keyword' => 'nullable|string|max:255',
            'page' => 'nullable|integer|min:1'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy bài viết phù hợp',
                'errors' => $validator->errors()
            ], 422);
        }
        $keyword = $request->input('keyword', '');
        $post = BaiViet::with([
            'nguoiTao' => function ($query) {
                // Trong file SQL của bạn: ma_nguoi_dung, ho_ten
                $query->select('ma_nguoi_dung', 'ho_ten');
            }
        ])
            ->where('tieu_de', 'LIKE', "%{$keyword}%") // Sửa lỗi 'ttieu_de'
            ->orWhere('noi_dung', 'LIKE', "%{$keyword}%")
            ->orderBy('ma_bai_viet', 'desc') // Khóa chính là ma_bai_viet
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $post
        ]);
    }
    //UC-24: Lọc công thức ở trang khám phá
    public function filterkhamPha(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'keyword' => 'nullable|string|max:255',
            'ma_danh_muc' => 'nullable|integer|exists:danh_muc,ma_danh_muc',
            'ma_vung_mien' => 'nullable|integer|exists:vung_mien,ma_vung_mien', // Kiểm tra có tồn tại ko
            'do_kho' => 'nullable|integer|between:1,5', // Độ khó 1 đến 5
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy bài viết phù hợp',
                'errors' => $validator->errors()
            ], 422);
        }

        $query = CongThuc::query();

        if ($request->filled('keyword')) {
            $query->where('ten_mon', 'LIKE', "%{$request->keyword}%");
        }
        if ($request->filled('ma_danh_muc')) {
            $query->where('ma_danh_muc', $request->ma_danh_muc);
        }
        if ($request->filled('ma_vung_mien')) {
            $query->where('ma_vung_mien', $request->ma_vung_mien);
        }
        if ($request->filled('do_kho')) {
            $query->where('do_kho', $request->do_kho);
        }

        $results = $query->orderBy('ma_cong_thuc', 'desc')->paginate(12);

        return response()->json(['status' => 'success', 'data' => $results]);
        return response()->json([
            'status' => 'success',
            'message' => 'Lọc công thức thành công',
            'data' => $results
        ], 422);
    }
}