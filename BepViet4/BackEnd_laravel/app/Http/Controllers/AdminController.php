<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\CongThuc;
use App\Models\NguoiDung;
use Illuminate\Support\Facades\DB;
use App\Models\NguoiDung;

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
    

public function DuyetCongThuc($id) 
{
    $recipe = CongThuc::find($id);
    if ($recipe) {
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

        // 3. Lọc theo trạng thái (giả sử bảng có cột trang_thai: 'active', 'blocked')
        // Nếu bảng chưa có cột này, bạn cần thêm vào DB hoặc bỏ qua
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
    
    // 3. Xử lý giới tính (DB cho phép NULL, React gửi 'nam'/'nu'/'khac')
    // Chú ý: Kiểm tra xem DB enum giới tính là 'Nam', 'Nữ' (có dấu) hay không dấu?
    // Nếu DB là 'Nam', 'Nữ' mà React gửi 'nam' (thường) cũng có thể bị lỗi.
    // Tốt nhất nên chuẩn hóa:
    $gioi_tinh_map = [
        'nam' => 'Nam',
        'nu' => 'Nữ', // Nếu DB lưu tiếng Việt có dấu
        'khac' => 'Khác'
    ];
    $user->gioi_tinh     = $gioi_tinh_map[$request->gioi_tinh] ?? 'Khác';

    // BỎ DÒNG NÀY ĐI VÌ DB KHÔNG CÓ CỘT trang_thai
    // $user->trang_thai    = 'active'; 

    $user->save();

    return response()->json(['message' => 'Tạo người dùng thành công!', 'user' => $user]);
}

    public function doiTrangThaiNguoiDung(Request $request, $id)
    {
        $user = NguoiDung::find($id);
        if (!$user) return response()->json(['message' => 'Không tìm thấy user'], 404);

        // Toggle: active <-> blocked
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
}
