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
            )
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
    
   
    $request->validate([
        'ten_mon' => 'required|string|max:255',
        'ma_danh_muc' => 'required|exists:danh_muc,ma_danh_muc',
        'thoi_gian_nau' => 'required|integer|min:1',
        'khau_phan' => 'required|integer|min:1',
        'do_kho' => 'required|integer|between:1,5',
        'hinh_anh_bia' => 'required|image|max:5120',
        
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

    
    DB::beginTransaction();

    try {
        $user = $request->user(); // Lấy user từ Token

        // --- BƯỚC 1: TẠO CÔNG THỨC CHÍNH ---
        $congThuc = CongThuc::create([
            'ma_nguoi_dung' => $user->ma_nguoi_dung,
            'ma_danh_muc'   => $request->ma_danh_muc,
            'ma_vung_mien'  => $request->ma_vung_mien, 
            'ten_mon'       => $request->ten_mon,
            'mo_ta'         => $request->mo_ta,
            'trang_thai' => 'cho_duyet',
            'thoi_gian_nau' => $request->thoi_gian_nau,
            'khau_phan'     => $request->khau_phan,
            'do_kho'        => $request->do_kho,
            'ngay_tao'      => now(),
        ]);

        // --- BƯỚC 2: XỬ LÝ ẢNH BÌA (Bảng hinh_anh_cong_thuc) ---
        if ($request->hasFile('hinh_anh_bia')) {
            $path = $request->file('hinh_anh_bia')->store('recipes/covers', 'public');
            HinhAnhCongThuc::create([
                'ma_cong_thuc' => $congThuc->ma_cong_thuc,
                'duong_dan'    => $path,
                'mo_ta'        => 'Ảnh bìa chính'
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
                'ma_cong_thuc'    => $congThuc->ma_cong_thuc, // ID món ăn
                'tieu_de_video'   => 'Video hướng dẫn làm ' . $congThuc->ten_mon,                
                'duong_dan_video' => $url,           // Lấy từ request gửi lên
                'nen_tang'        => $nenTang,       // Youtube/Tiktok...
                'la_video_chinh'  => 1,              // Mặc định video upload lúc tạo là video chính
                'thoi_luong'      => null            // Vì chỉ có link nên chưa biết thời lượng, để null
            ]);
        }

        // --- BƯỚC 4: XỬ LÝ TAGS (Bảng trung gian cong_thuc_the) ---
        if ($request->filled('tags')) {
            $tagIds = [];
            foreach ($request->tags as $tagName) {
                $tag = The::firstOrCreate(
                    ['ten_the' => trim($tagName)],
                    ['slug' => Str::slug($tagName)] 
                );
                $tagIds[] = $tag->ma_the;
            }
            $congThuc->the()->attach($tagIds);
        }

        // --- BƯỚC 5: XỬ LÝ NGUYÊN LIỆU (Bảng trung gian cong_thuc_nguyen_lieu) ---
        foreach ($request->nguyen_lieu as $nlItem) {
            $nguyenLieu = NguyenLieu::firstOrCreate(
                ['ten_nguyen_lieu' => trim($nlItem['ten_nguyen_lieu'])],
                ['loai_nguyen_lieu' => $nlItem['loai_nguyen_lieu'] ?? 'Khác']
            );

            // 5.2 Attach vào bảng trung gian kèm số lượng
            // attach(ID, [các_cột_phụ])
            $congThuc->nguyenLieu()->attach($nguyenLieu->ma_nguyen_lieu, [
                'dinh_luong'    => $nlItem['dinh_luong'],
                'don_vi_tinh' => $nlItem['don_vi_tinh']
            ]);
        }

        // --- BƯỚC 6: XỬ LÝ CÁC BƯỚC THỰC HIỆN + ẢNH BƯỚC ---
        // Giả sử client gửi dạng: cac_buoc[0][noi_dung], cac_buoc[0][hinh_anh] (file)
        
        if ($request->has('cac_buoc')) {
            foreach ($request->cac_buoc as $index => $stepData) {
                // 6.1 Tạo bước
                $buoc = BuocThucHien::create([
                    'ma_cong_thuc' => $congThuc->ma_cong_thuc,
                    'so_thu_tu'       => $index + 1, 
                    'noi_dung'     => $stepData['noi_dung']
                ]);

                // 6.2 Kiểm tra xem bước này có ảnh không
                // Trong FormData: cac_buoc[0][hinh_anh]
                if (isset($stepData['hinh_anh']) && $request->hasFile("cac_buoc.$index.hinh_anh")) {
                    $files = $request->file("cac_buoc.$index.hinh_anh");
                    
                    // Nếu client gửi 1 file hay nhiều file cho 1 bước
                    if (!is_array($files)) {
                        $files = [$files];
                    }

                    foreach ($files as $file) {
                        $pathStep = $file->store('recipes/steps', 'public');
                        HinhAnhBuoc::create([
                            'ma_buoc'   => $buoc->ma_buoc,
                            'duong_dan' => $pathStep,
                            'mo_ta'     => 'Ảnh minh họa bước ' . ($index + 1)
                        ]);
                    }
                }
            }
        }

        // --- HOÀN TẤT ---
        DB::commit();

        return response()->json([
            'status'  => 'success',
            'message' => 'Công thức đang chờ duyệt!',
            'data'    => $congThuc->load('hinhAnh', 'nguyenLieu', 'the', 'cacBuoc.hinhAnhBuoc')
        ], 201);

    } catch (\Exception $e) {
        // CÓ LỖI -> HOÀN TÁC TOÀN BỘ
        DB::rollBack();
        Log::error("Lỗi tạo công thức: " . $e->getMessage());

        return response()->json([
            'status'  => 'error',
            'message' => 'Đã xảy ra lỗi hệ thống, vui lòng thử lại.',
            'debug'   => $e->getMessage() // Tắt dòng này khi chạy thật (Production)
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
            $recipe = CongThuc::getDetailBasic((int)$id);

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

   
    public function update(Request $request, $id)
    {
        // 1. Tìm công thức cần sửa
        $congThuc = CongThuc::findOrFail($id);
    
        // Kiểm tra quyền (Ví dụ: chỉ người tạo mới được sửa)
        if ($congThuc->ma_nguoi_dung !== $request->user()->ma_nguoi_dung) {
            return response()->json(['message' => 'Bạn không có quyền sửa công thức này'], 403);
        }
    
        // 2. Validate (giống store nhưng có thể bỏ 'required' ở một số trường để cho phép cập nhật từng phần)
        $request->validate([
            'ten_mon' => 'sometimes|required|string|max:255',
            'ma_danh_muc' => 'sometimes|required|exists:danh_muc,ma_danh_muc',
            'thoi_gian_nau' => 'sometimes|required|integer|min:1',
            'khau_phan' => 'sometimes|required|integer|min:1',
            'do_kho' => 'sometimes|required|integer|between:1,5',
            'hinh_anh_bia' => 'nullable|image|max:5120',
            'nguyen_lieu' => 'sometimes|required|array',
            'cac_buoc' => 'sometimes|required|array',
            'tags' => 'nullable|array'
        ]);
    
        DB::beginTransaction();
    
        try {
            // --- BƯỚC 1: CẬP NHẬT THÔNG TIN CHÍNH ---
            $congThuc->update($request->only([
                'ma_danh_muc', 'ma_vung_mien', 'ten_mon', 'mo_ta', 'thoi_gian_nau', 'khau_phan', 'do_kho'
            ]));
    
            // --- BƯỚC 2: XỬ LÝ ẢNH BÌA MỚI ---
            if ($request->hasFile('hinh_anh_bia')) {
                // Xóa ảnh cũ nếu cần (tùy logic của bạn)
                // Storage::disk('public')->delete($congThuc->hinhAnh->duong_dan);
                
                $path = $request->file('hinh_anh_bia')->store('recipes/covers', 'public');
                
                // Cập nhật hoặc tạo mới ảnh bìa
                HinhAnhCongThuc::updateOrCreate(
                    ['ma_cong_thuc' => $congThuc->ma_cong_thuc],
                    ['duong_dan' => $path, 'mo_ta' => 'Ảnh bìa chính']
                );
            }
    
            // --- BƯỚC 3: XỬ LÝ VIDEO ---
            if ($request->filled('video_url')) {
                $url = $request->video_url;
                $nenTang = str_contains($url, 'youtube') ? 'Youtube' : (str_contains($url, 'tiktok') ? 'Tiktok' : 'Website');
    
                VideoHuongDan::updateOrCreate(
                    ['ma_cong_thuc' => $congThuc->ma_cong_thuc],
                    [
                        'tieu_de_video' => 'Video hướng dẫn làm ' . $congThuc->ten_mon,
                        'duong_dan_video' => $url,
                        'nen_tang' => $nenTang,
                        'la_video_chinh' => 1
                    ]
                );
            }
    
            // --- BƯỚC 4: XỬ LÝ TAGS (Sử dụng sync) ---
            if ($request->has('tags')) {
                $tagIds = [];
                foreach ($request->tags as $tagName) {
                    $tag = The::firstOrCreate(
                        ['ten_the' => trim($tagName)],
                        ['slug' => Str::slug($tagName)]
                    );
                    $tagIds[] = $tag->ma_the;
                }
                $congThuc->the()->sync($tagIds); 
            }
    
            // --- BƯỚC 5: XỬ LÝ NGUYÊN LIỆU ---
            if ($request->has('nguyen_lieu')) {
                $syncData = [];
                foreach ($request->nguyen_lieu as $nlItem) {
                    $nguyenLieu = NguyenLieu::firstOrCreate(
                        ['ten_nguyen_lieu' => trim($nlItem['ten_nguyen_lieu'])],
                        ['loai_nguyen_lieu' => $nlItem['loai_nguyen_lieu'] ?? 'Khác']
                    );
                    
                    $syncData[$nguyenLieu->ma_nguyen_lieu] = [
                        'dinh_luong' => $nlItem['dinh_luong'],
                        'don_vi_tinh' => $nlItem['don_vi_tinh']
                    ];
                }
                $congThuc->nguyenLieu()->sync($syncData);
            }
    
            // --- BƯỚC 6: XỬ LÝ CÁC BƯỚC THỰC HIỆN (Xóa cũ tạo mới cho đơn giản) ---
            if ($request->has('cac_buoc')) {
    
                $congThuc->cacBuoc()->delete(); 
    
                foreach ($request->cac_buoc as $index => $stepData) {
                    $buoc = BuocThucHien::create([
                        'ma_cong_thuc' => $congThuc->ma_cong_thuc,
                        'so_thu_tu'    => $index + 1,
                        'noi_dung'     => $stepData['noi_dung']
                    ]);
    
                    // Xử lý ảnh cho từng bước (nếu có gửi lên)
                    if (isset($stepData['hinh_anh']) && $request->hasFile("cac_buoc.$index.hinh_anh")) {
                        $files = $request->file("cac_buoc.$index.hinh_anh");
                        if (!is_array($files)) $files = [$files];
    
                        foreach ($files as $file) {
                            $pathStep = $file->store('recipes/steps', 'public');
                            HinhAnhBuoc::create([
                                'ma_buoc'   => $buoc->ma_buoc,
                                'duong_dan' => $pathStep,
                                'mo_ta'     => 'Ảnh minh họa bước ' . ($index + 1)
                            ]);
                        }
                    }
                }
            }
    
            DB::commit();
    
            return response()->json([
                'status'  => 'success',
                'message' => 'Cập nhật công thức thành công!',
                'data'    => $congThuc->load('hinhAnh', 'nguyenLieu', 'the', 'cacBuoc.hinhAnhBuoc')
            ]);
    
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Lỗi cập nhật công thức: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Lỗi hệ thống'], 500);
        }
    }

    // 18. DELETE /recipes/{id}:
    public function destroy($id)
{
    // Tìm công thức
    $congThuc = CongThuc::find($id);

    if (!$congThuc) {
        return response()->json(['message' => 'Không tìm thấy công thức'], 404);
    }

    
    $congThuc->delete();

    return response()->json([
        'status' => 'success', 
        'message' => 'Đã xóa công thức thành công (đưa vào thùng rác)!'
    ], 200);
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
