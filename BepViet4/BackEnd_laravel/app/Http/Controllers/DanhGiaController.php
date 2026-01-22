<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DanhGia;
use App\Models\CongThuc;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // Đã thêm

class DanhGiaController extends Controller
{
    public function submitRating(Request $request)
    {
        Log::info('--- Bắt đầu API submitRating ---');
        Log::info('Dữ liệu gửi lên:', $request->all());

        try {
            $request->validate([
                'ma_cong_thuc' => 'required|integer|exists:cong_thuc,ma_cong_thuc', 
                'so_sao'       => 'required|integer|min:1|max:5',           
            ]);

            $user = Auth::user();
            if (!$user) {
                Log::warning('Lỗi: User chưa đăng nhập');
                return response()->json(['message' => 'Bạn cần đăng nhập'], 401);
            }

            $userId = $user->ma_nguoi_dung ?? $user->id; 
            Log::info('User ID thực hiện đánh giá: ' . $userId);

            $danhGia = DanhGia::updateOrCreate(
                [
                    'ma_nguoi_dung' => $userId,
                    'ma_cong_thuc'  => $request->ma_cong_thuc,
                ],
                [
                    'so_sao' => $request->so_sao,
                    'trang_thai' => 1
                ]
            );

            $stats = $this->calculateRatingStats($request->ma_cong_thuc);

            Log::info('Đánh giá thành công cho công thức: ' . $request->ma_cong_thuc);

            return response()->json([
                'status'  => 'success',
                'message' => 'Đánh giá thành công!',
                'data'    => [
                    'rating_id' => $danhGia->ma_danh_gia ?? $danhGia->id,
                    'my_rating' => $danhGia->so_sao,
                ],
                'stats'   => $stats 
            ]);

        } catch (\Exception $e) {
            Log::error('LỖI SUBMIT RATING: ' . $e->getMessage());
            return response()->json([
                'message' => 'Có lỗi xảy ra trên server',
                'error' => $e->getMessage() // Chỉ hiện khi đang code để dễ debug
            ], 500);
        }
    }

    public function getRatingInfo(Request $request, $ma_cong_thuc)
    {
        try {
            if (!CongThuc::where('ma_cong_thuc', $ma_cong_thuc)->exists()) {
                return response()->json(['message' => 'Công thức không tồn tại'], 404);
            }

            $stats = $this->calculateRatingStats($ma_cong_thuc);
            $myRating = 0;
            $hasRated = false;
            
            $user = Auth::guard('sanctum')->user();
            if ($user) {
                $userId = $user->ma_nguoi_dung ?? $user->id;
                $rating = DanhGia::where('ma_nguoi_dung', $userId)
                                 ->where('ma_cong_thuc', $ma_cong_thuc)
                                 ->first();
                if ($rating) {
                    $myRating = $rating->so_sao;
                    $hasRated = true;
                }
            }

            return response()->json([
                'ma_cong_thuc'   => (int)$ma_cong_thuc,
                'trung_binh'     => $stats['trung_binh'],
                'tong_so_luot'   => $stats['tong_so_luot'],
                'da_danh_gia'    => $hasRated,
                'diem_cua_toi'   => $myRating,
                'chi_tiet_sao'   => $stats['chi_tiet_sao']
            ]);
        } catch (\Exception $e) {
            Log::error('LỖI GET RATING INFO: ' . $e->getMessage());
            return response()->json(['message' => 'Server Error'], 500);
        }
    }

    private function calculateRatingStats($recipeId)
    {
        // Lấy thống kê và ép kiểu ngay trong query
        $thongKe = DanhGia::where('ma_cong_thuc', $recipeId)
            ->select(
                DB::raw('COUNT(*) as tong_so_luot'),
                DB::raw('AVG(so_sao) as trung_binh')
            )
            ->first();

        $tongSoLuot = $thongKe ? (int)$thongKe->tong_so_luot : 0;
        // Chuyển trung_binh về float trước khi round để tránh lỗi
        $trungBinh = $thongKe && $thongKe->trung_binh ? round((float)$thongKe->trung_binh, 1) : 0;

        $chiTiet = DanhGia::where('ma_cong_thuc', $recipeId)
            ->select('so_sao', DB::raw('count(*) as so_luong'))
            ->groupBy('so_sao')
            ->orderBy('so_sao', 'desc')
            ->get()
            ->map(function($item) {
                return [
                    'so_sao' => (int)$item->so_sao,
                    'so_luong' => (int)$item->so_luong
                ];
            });

        return [
            'tong_so_luot' => $tongSoLuot,
            'trung_binh'   => $trungBinh,
            'chi_tiet_sao' => $chiTiet
        ];
    }
}