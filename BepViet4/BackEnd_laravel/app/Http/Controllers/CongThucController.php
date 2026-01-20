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
            'ma_danh_muc'   => $request->ma_danh_muc,
            'ma_vung_mien'  => $request->ma_vung_mien, // Có thể null
            'ten_mon'       => $request->ten_mon,
            'mo_ta'         => $request->mo_ta,
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
                'dinh_luong'    => $nlItem['dinh_luong'],
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
                    'so_thu_tu'       => $index + 1, // Tự động tăng thứ tự 1, 2, 3...
                    'noi_dung'     => $stepData['noi_dung']
                ]);

                // 6.2 Kiểm tra xem bước này có ảnh không
                // Trong FormData: cac_buoc[0][hinh_anh]
                // Laravel Request sẽ hứng được file ở đúng index đó
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
            'message' => 'Tạo công thức thành công!',
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
}
