<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\CongThuc;
use App\Models\NguoiDung;
use App\Models\BaiViet;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;
class AdminController extends Controller
{
    
    public function getCongThucChoDuyet()
    {
        $recipes = CongThuc::with('nguoiTao')
            ->where('trang_thai', 'cho_duyet')
            ->whereExists(function ($q) {
                $q->select(DB::raw(1))
                  ->from('hinh_anh_cong_thuc')
                  ->whereColumn(
                      'hinh_anh_cong_thuc.ma_cong_thuc',
                      'cong_thuc.ma_cong_thuc'
                  );
            })
            ->orderBy('created_at', 'asc')
            ->paginate(20);
    
        return response()->json([
            'status' => 'success',
            'data' => $recipes
        ]);
    }
    

// Thêm Request vào tham số
public function DuyetCongThuc(Request $request, $id) 
{
    $recipe = CongThuc::find($id);

    if (!$recipe) {
        return response()->json(['message' => 'Không tìm thấy bài viết'], 404);
    }

    // 1. Lấy trạng thái từ React gửi lên ('cong_khai' hoặc 'tu_choi')
    $status = $request->input('status'); 

    // 2. Kiểm tra logic
    if ($status === 'tu_choi') {
        // Trường hợp TỪ CHỐI:
        // Ta thực hiện xóa mềm (Soft Delete). 
        // Khi xóa mềm, deleted_at sẽ được set ngày giờ, Eloquent sẽ tự động loại nó ra khỏi các thống kê.
        $recipe->delete(); 
        
        return response()->json(['message' => 'Đã từ chối bài viết']);
    } else {
        // Trường hợp DUYỆT:
        $recipe->trang_thai = 'cong_khai'; 
        $recipe->save();
        
        return response()->json(['message' => 'Đã duyệt bài viết']);
    }
}

public function getStatistical()
{
    $data = DB::table(DB::raw('(SELECT 1) as dummy'))
        ->select([
            DB::raw('(SELECT COUNT(*) FROM nguoi_dung) as total_users'),
            DB::raw('(SELECT COUNT(*) FROM cong_thuc) as total_recipes'),
            DB::raw("(SELECT COUNT(*) FROM cong_thuc WHERE trang_thai = 'cho_duyet') as pending_recipes"),
            DB::raw('(SELECT COUNT(*) FROM bao_cao) as reports'),
            DB::raw("'99.9%' as system_status"),
        ])
        ->first();

    return response()->json($data);
}


    public function getRecipeInWeek()
    {
        $data = CongThuc::select(DB::raw('DATE(ngay_tao) as date'), DB::raw('count(*) as value'))
            ->where('ngay_tao', '>=', now()->subDays(7))
            ->groupBy('date')
            ->get();
            
        return response()->json($data);
    }


public function getDanhSachNguoiDung(Request $request)
    {
        $query = NguoiDung::query(); // Model trỏ vào bảng nguoi_dung

        // 1. Tìm kiếm (Tên hoặc Email)
        if ($request->keyword) {
            $kw = $request->keyword;
            $query->where(function($q) use ($kw) {
                $q->where('ho_ten', 'like', "%{$kw}%")
                  ->orWhere('email', 'like', "%{$kw}%");
            });
        }

        // 2. Lọc theo vai trò
        if ($request->role && $request->role !== 'All') {
            $query->where('vai_tro', $request->role);
        }

        if ($request->status && $request->status !== 'All') {
            $query->where('trang_thai', $request->status);
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $users
        ]);
    }

    public function taoNguoiDung(Request $request)
{
    // 1. Validate
    $validator = Validator::make($request->all(), [
        'ten_dang_nhap' => 'required|unique:nguoi_dung',
        'email'         => 'required|email|unique:nguoi_dung',
        'mat_khau'      => 'required|min:6',
        'ho_ten'        => 'required',
        // Validate đúng theo enum trong DB: admin, member, blogger
        'vai_tro'       => 'required|in:admin,member,blogger', 
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // 2. Lưu vào DB
    $user = new NguoiDung();
    $user->ten_dang_nhap = $request->ten_dang_nhap;
    $user->email         = $request->email;
    $user->mat_khau      = Hash::make($request->mat_khau);
    $user->ho_ten        = $request->ho_ten;
    $user->vai_tro       = $request->vai_tro;

    $gioi_tinh_map = [
        'nam' => 'Nam',
        'nu' => 'Nữ', 
        'khac' => 'Khác'
    ];
    $user->gioi_tinh     = $gioi_tinh_map[$request->gioi_tinh] ?? 'Khác';
    $user->save();

    return response()->json(['message' => 'Tạo người dùng thành công!', 'user' => $user]);
}

    public function doiTrangThaiNguoiDung(Request $request, $id)
    {
        $user = NguoiDung::find($id);
        if (!$user) return response()->json(['message' => 'Không tìm thấy user'], 404);

        $user->trang_thai = ($user->trang_thai === 'active') ? 'blocked' : 'active';
        $user->save();

        return response()->json(['message' => 'Đã cập nhật trạng thái!', 'status' => $user->trang_thai]);
    }

    public function xoaNguoiDung($id)
    {
        $user = NguoiDung::find($id);
        if (!$user) return response()->json(['message' => 'Không tìm thấy user'], 404);

        $user->delete();
        return response()->json(['message' => 'Đã xóa người dùng vĩnh viễn']);
    }

    public function getDashboardStats()
{
    try {
        // 1. Đếm User
        $totalUsers = NguoiDung::count();

        // 2. Đếm công thức CÔNG KHAI
        $totalRecipes = CongThuc::where('trang_thai', 'cong_khai')->count();

        // 3. Đếm công thức CHỜ DUYỆT
        $pendingRecipes = CongThuc::where('trang_thai', 'cho_duyet')->count();

        // 4. Đếm Blog
        $totalBlogs = BaiViet::count();

        // 5. Đếm báo cáo (Dùng try-catch riêng để tránh sập web nếu chưa có bảng này)
        $violationReports = 0;
        try {
            $violationReports = DB::table('bao_cao')->count();
        } catch (Exception $e) {
            $violationReports = 0; // Nếu lỗi bảng báo cáo thì coi như là 0
        }

        // --- XỬ LÝ BIỂU ĐỒ ---
        // Kiểm tra xem bảng có dữ liệu không để tránh lỗi lấy mẫu
        $sample = CongThuc::first();
        
        // Mặc định là created_at, nếu không có mới check ngay_tao
        $columnDate = 'created_at'; 
        if ($sample) {
            // Kiểm tra an toàn: nếu model có thuộc tính ngay_tao và created_at bị null
            if (!isset($sample->created_at) && isset($sample->ngay_tao)) {
                $columnDate = 'ngay_tao';
            }
        }

        // Dùng now() thay vì Carbon::now() để đỡ phải import thư viện
        $chartData = CongThuc::select(
                DB::raw("DATE($columnDate) as date"),
                DB::raw('count(*) as value')
            )
            ->where('trang_thai', 'cong_khai') // Chỉ lấy bài đã duyệt
            ->where($columnDate, '>=', now()->subDays(30)) 
            ->groupBy(DB::raw("DATE($columnDate)")) // Sửa lại: Group by trực tiếp lệnh gốc để tránh lỗi SQL strict
            ->orderBy('date', 'ASC')
            ->get();

        // --- XỬ LÝ DANH MỤC ---
        $popularCategories = collect([]);
        try {
            $popularCategories = DB::table('danh_muc')
                ->join('cong_thuc', 'danh_muc.ma_danh_muc', '=', 'cong_thuc.ma_danh_muc')
                ->where('cong_thuc.trang_thai', 'cong_khai') // Chỉ tính bài đã duyệt
                ->select(
                    'danh_muc.ten_danh_muc as name',
                    DB::raw('count(cong_thuc.ma_cong_thuc) as count')
                )
                ->groupBy('danh_muc.ma_danh_muc', 'danh_muc.ten_danh_muc')
                ->orderByDesc('count')
                ->limit(5)
                ->get();
        } catch (Exception $e) {
            // Bỏ qua lỗi nếu bảng danh mục có vấn đề
        }

        // Tính phần trăm
        $popularCategories = $popularCategories->map(function ($item) use ($totalRecipes) {
            $item->percent = $totalRecipes > 0 ? round(($item->count / $totalRecipes) * 100) : 0;
            return $item;
        });

        return response()->json([
            'counts' => [
                'users' => $totalUsers,
                'recipes' => $totalRecipes,
                'pending' => $pendingRecipes,
                'blogs' => $totalBlogs,
                'reports' => $violationReports
            ],
            'chart' => $chartData,
            'categories' => $popularCategories
        ]);

    } catch (Exception $e) {
        // Log lỗi ra để bạn debug trong Laravel log
        Log::error("Dashboard Error: " . $e->getMessage());
        
        return response()->json([
            'message' => 'Lỗi Backend: ' . $e->getMessage()
        ], 500);
    }
}

}

