<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LuotThich;
use App\Models\BaiViet;
use Illuminate\Support\Facades\Auth;

class LuotThichController extends Controller
{
    // Đặt tên model chuẩn xác dưới dạng chuỗi để tránh lỗi namespace
    private $postModel = 'App\Models\BaiViet';

    /**
     * API: Thích hoặc Huỷ thích (Toggle)
     */
    public function toggleLike(Request $request)
    {
        // 1. Validate dữ liệu đầu vào
        $request->validate([
            'ma_bai_viet' => 'required|integer', 
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Chưa đăng nhập'], 401);
        }

        $userId = $user->ma_nguoi_dung ?? $user->id;
        $postId = $request->ma_bai_viet;

        // 2. Tìm xem đã like chưa
        // Lưu ý: Dùng where để tìm chính xác record
        $like = LuotThich::where('ma_nguoi_dung', $userId)
            ->where('thich_id', $postId)
            ->where('thich_type', $this->postModel) 
            ->first();

        $status = '';
        $message = '';

        if ($like) {
            // 3a. Nếu đã like rồi -> XÓA (Unlike)
            $like->delete();
            $status = 'unliked';
            $message = 'Đã bỏ thích';
        } else {
            // 3b. Nếu chưa like -> TẠO MỚI (Like)
            LuotThich::create([
                'ma_nguoi_dung' => $userId,
                'thich_id'      => $postId,
                'thich_type'    => $this->postModel
            ]);
            $status = 'liked';
            $message = 'Đã thích';
        }

        // 4. Tính lại tổng số like để trả về Frontend cập nhật ngay
        $totalLikes = LuotThich::where('thich_id', $postId)
            ->where('thich_type', $this->postModel)
            ->count();

        return response()->json([
            'status'      => 'success',
            'action'      => $status, // 'liked' hoặc 'unliked'
            'message'     => $message,
            'total_likes' => $totalLikes,
            'has_liked'   => ($status === 'liked')
        ]);
    }

    /**
     * API: Lấy thông tin Like (Dùng cho useEffect ở Frontend)
     */
    public function getLikeInfo(Request $request, $ma_bai_viet)
    {
        // Debug: Ghi log xem ID nhận được là gì
        \Log::info("Check like info cho bài viết ID: " . $ma_bai_viet);

        $totalLikes = LuotThich::where('thich_id', $ma_bai_viet)
            ->where('thich_type', $this->postModel) // Quan trọng: check kỹ cái này
            ->count();

        $hasLiked = false;
        
        // Đoạn này check User có đang login không
        $user = Auth::guard('sanctum')->user();
        
        if ($user) {
            $userId = $user->ma_nguoi_dung ?? $user->id;
            $hasLiked = LuotThich::where('ma_nguoi_dung', $userId)
                ->where('thich_id', $ma_bai_viet)
                ->where('thich_type', $this->postModel)
                ->exists();
        }

        return response()->json([
            'ma_bai_viet' => (int)$ma_bai_viet,
            'total_likes' => $totalLikes,
            'has_liked' => $hasLiked
        ]);
    }
}