<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\NguoiDung;
use App\Models\CongThuc;
use Illuminate\Support\Facades\DB;
use App\Models\BaiViet;

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
}
