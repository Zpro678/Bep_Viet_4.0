<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TheoDoi;
use App\Models\NguoiDung;

class TheoDoiController extends Controller
{
    // THEO DÕI NGƯỜI DÙNG
    public function follow($id, Request $request)
    {
        $authUser = $request->user(); // user đang đăng nhập (token)

        // không cho follow chính mình
        if ($authUser->ma_nguoi_dung == $id) {
            return response()->json([
                'message' => 'Không thể theo dõi chính mình'
            ], 400);
        }

        $targetUser = NguoiDung::find($id);

        if (!$targetUser) {
            return response()->json([
                'message' => 'Người dùng không tồn tại'
            ], 404);
        }

        // Thêm follow
        $follow = TheoDoi::theoDoi($authUser->ma_nguoi_dung, $id);

        if (!$follow->wasRecentlyCreated) {
            return response()->json([
                'message' => 'Bạn đã theo dõi người này rồi'
            ], 409);
        }

        return response()->json([
            'message' => 'Theo dõi thành công'
        ], 201);
    }

    // BỎ THEO DÕI
    public function unfollow($id, Request $request)
    {
        $userDangNhap = $request->user();

        // Không thể unfollow chính mình
        if ($userDangNhap->id == $id) {
            return response()->json([
                'message' => 'Không thể hủy theo dõi chính mình'
            ], 400);
        }

        // Người dùng không tồn tại
        if (!NguoiDung::find($id)) {
            return response()->json([
                'message' => 'Người dùng không tồn tại'
            ], 404);
        }

       $deleted = TheoDoi::huyTheoDoi($userDangNhap->ma_nguoi_dung, $id);

       if ($deleted === 0) {
            return response()->json([
                'message' => 'Bạn chưa theo dõi người này'
            ], 409);
        }

        return response()->json([
            'message' => 'Hủy theo dõi thành công'
        ]);
    }

    // XEM DS NGƯỜI THEO DÕI CỦA USER
    public function followers($id)
    {
        // User không tồn tại
        if (!NguoiDung::find($id)) {
            return response()->json([
                'message' => 'Người dùng không tồn tại'
            ], 404);
        }

        return TheoDoi::where('ma_nguoi_duoc_theo_doi', $id)
            ->with('nguoiTheoDoi')
            ->get();
    }
}
