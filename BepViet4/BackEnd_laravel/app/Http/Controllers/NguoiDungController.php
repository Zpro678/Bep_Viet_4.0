<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\NguoiDung;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\CongThuc;

class NguoiDungController extends Controller
{
    public function profile(Request $request)
    {
        // middleware 'auth:sanctum' -> Laravel tự tìm đến user và gắn vào $request
        $user = $request->user();

        return response()->json([
            'status' => 'success',
            'message' => 'Lấy thông tin thành công.',
            'data' => $user
        ], 200);
    }
    // ================================== Cập nhật thông tin người dùng ===================================
    public function updateProfile(Request $request)
    {
        $user = $request->user(); // Lấy user hiện tại từ Token

        $validator = Validator::make($request->all(), [
            'ho_ten' => 'nullable|string|max:255',
           
           'email' => [
                'nullable',
                'email',
                // Rule::unique(NguoiDung::class)->ignore($user->id) // Email phải là duy nhất, nhưng trừ user hiện tại
                Rule::unique('nguoi_dung', 'email')
                    ->ignore($user->ma_nguoi_dung, 'ma_nguoi_dung')
            ],
            // 'so_dien_thoai' => 'nullable|string|max:20',
            'ngay_sinh' => 'nullable|date|before_or_equal:today',
            'mat_khau' => 'nullable|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        if ($request->has('ho_ten')) {
            $user->ho_ten = $request->ho_ten;
        }
        
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        
        if ($request->has('ngay_sinh')) {
            $user->ngay_sinh = $request->ngay_sinh;
        }
        
        if ($request->has('gioi_tinh')) {
            $user->gioi_tinh = $request->gioi_tinh;
        }

        // --- 3. LOGIC ĐỔI MẬT KHẨU (SỬA ĐOẠN NÀY) ---
        if ($request->filled('mat_khau')) {
            // A. Kiểm tra xem người dùng có gửi mật khẩu cũ lên không?
            if (!$request->filled('mat_khau_cu')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Vui lòng nhập mật khẩu hiện tại để thay đổi mật khẩu mới.'
                ], 422);
            }

            // B. Kiểm tra mật khẩu cũ có khớp với Database không?
            // Hash::check(mật_khau_nhập_vào, mật_khau_trong_db)
            if (!Hash::check($request->mat_khau_cu, $user->mat_khau)) {
                return response()->json([
                    'status' => 'error',
                    // Trả về lỗi dạng này để Frontend dễ bắt
                    'message' => 'Mật khẩu hiện tại không chính xác.',
                    'errors' => ['mat_khau_cu' => ['Mật khẩu hiện tại không đúng']] 
                ], 422);
            }

            // C. Nếu đúng hết thì mới đổi
            $user->mat_khau = Hash::make($request->mat_khau);
        }

        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật thông tin thành công.',
            'data' => $user
        ], 200);
    }

    // ================================== Lấy thông tin người dùng ===================================
    public function show($id)
    {

        $user = NguoiDung::select('ma_nguoi_dung', 'ho_ten','gioi_tinh', 'vai_tro', 'created_at')
            ->where('ma_nguoi_dung', $id)
            ->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Người dùng không tồn tại.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $user
        ], 200);
    }

    // ================================== Thống kê tổng quan người dùng ===================================
    public function overview($id)
    {

        $user = NguoiDung::withCount([
            'congThuc',
            'baiViet',
            'boSuuTap',
            'nguoiTheoDoi',
            'dangTheoDoi'
        ])->find($id);


        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Người dùng không tồn tại'
            ], 404);
        }

        $totalLikes = $user->baiViet()->sum('luot_yeu_thich');

        $responseData = [
            'id' => $user->ma_nguoi_dung,
            'ten_dang_nhap' => $user->ten_dang_nhap,
            'ho_ten' => $user->ho_ten,
            // 'avatar' => $user->anh_dai_dien ?? null, 
            'vai_tro' => $user->vai_tro,
            'ThongKe' => [
                'tong_cong_thuc' => $user->cong_thuc_count,
                'tong_bai_viet' => $user->bai_viet_count,
                'tong_bo_suu_tap' => $user->bo_suu_tap_count,
                'tong_nguoi_theo_doi' => $user->nguoi_theo_doi_count,
                'tong_nguoi_dang_theo_doi' => $user->dang_theo_doi_count,
                'tong_luot_yeu_thich' => (int) $totalLikes
            ]
        ];

        return response()->json([
            'status' => 'success',
            'data' => $responseData
        ], 200);
    }
    // ================================== Thống kê tổng quan người dùng hiện tại ===================================
    public function meOverview(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Người dùng không tồn tại'
            ], 404);
        }
        $user->loadCount([
            'congThuc',
            'baiViet',
            'boSuuTap',
            'nguoiTheoDoi',
            'dangTheoDoi'
        ]);

        $totalLikes = $user->baiViet()->sum('luot_yeu_thich');

        $responseData = [
            'id' => $user->ma_nguoi_dung,
            'ten_dang_nhap' => $user->ten_dang_nhap,
            'ho_ten' => $user->ho_ten,
            // 'avatar' => $user->anh_dai_dien ?? null, 
            'vai_tro' => $user->vai_tro,
            'ThongKe' => [
                'tong_cong_thuc' => $user->cong_thuc_count,
                'tong_bai_viet' => $user->bai_viet_count,
                'tong_bo_suu_tap' => $user->bo_suu_tap_count,
                'tong_nguoi_theo_doi' => $user->nguoi_theo_doi_count,
                'tong_nguoi_dang_theo_doi' => $user->dang_theo_doi_count,
                'tong_luot_yeu_thich' => (int) $totalLikes
            ]
        ];

        return response()->json([
            'status' => 'success',
            'data' => $responseData
        ], 200);
    }
}
