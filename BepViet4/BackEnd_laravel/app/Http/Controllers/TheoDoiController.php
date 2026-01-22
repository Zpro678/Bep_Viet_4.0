<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\NguoiDung;

class TheoDoiController extends Controller
{
    public function checkFollowStatus(Request $request, $id)
    {
        $currentUser = $request->user();

        // Nếu không login hoặc tự xem chính mình thì luôn trả về false
        if (!$currentUser) {
            return response()->json(['message' => 'Chưa login'], 401); // Nếu trả về 401 là do Token chưa tới được đây
        }
        
        if ($currentUser->ma_nguoi_dung == $id) {
            return response()->json([
                'status' => 'success',
                'data' => ['is_following' => false]
            ]);
        }

        // Gọi hàm từ Model đã viết ở trên
        $isFollowing = $currentUser->isFollowing($id);

        return response()->json([
            'status' => 'success',
            'data' => [
                'is_following' => $isFollowing
            ]
        ]);
    }

    public function follow(Request $request, $id)
    {
        $currentUser = $request->user();

        if ($currentUser->ma_nguoi_dung == $id) {
            return response()->json([
                'status' => false,
                'message' => 'Không thể theo dõi chính mình'
            ], 400);
        }

        $targetUser = NguoiDung::find($id);
        if (!$targetUser) {
            return response()->json([
                'status' => false,
                'message' => 'Người dùng không tồn tại'
            ], 404);
        }

        // Kiểm tra đã theo dõi chưa
        $isFollowing = $currentUser->isFollowing($id);

        if ($isFollowing) {
            return response()->json([
                'status' => true,
                'message' => 'Bạn đã theo dõi người này rồi'
            ]);
        }

        // Thực hiện follow
        $currentUser->dangTheoDoi()->attach($id, [
            'trang_thai' => 1,
            'ngay_theo_doi' => now()
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Theo dõi thành công',
            'data' => [
                'nguoi_theo_doi' => $currentUser->ma_nguoi_dung,
                'nguoi_duoc_theo_doi' => $id
            ]
        ]);
    }

    public function unfollow(Request $request, $id)
    {
        $currentUser = $request->user();

        // Kiểm tra đang theo dõi không
        $isFollowing = $currentUser->isFollowing($id);

        if (!$isFollowing) {
            return response()->json([
                'status' => false,
                'message' => 'Bạn chưa theo dõi người này'
            ], 400);
        }

        $currentUser->dangTheoDoi()->detach($id);

        return response()->json([
            'status' => true,
            'message' => 'Đã hủy theo dõi',
            'data' => [
                'nguoi_theo_doi' => $currentUser->ma_nguoi_dung,
                'nguoi_duoc_theo_doi' => $id
            ]
        ]);
    }

    public function getFollowers(Request $request, $id)
    {
        $user = NguoiDung::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Người dùng không tồn tại'
            ], 404);
        }

        $followers = $user->nguoiTheoDoi()
            ->select('nguoi_dung.ma_nguoi_dung', 'nguoi_dung.ho_ten')
            ->paginate(10);

        if ($currentUser = $request->user('sanctum')) {
            $myFollowingIds = $currentUser->dangTheoDoi()->pluck('nguoi_dung.ma_nguoi_dung')->toArray();

            $followers->getCollection()->transform(
                function ($follower) use ($myFollowingIds) {
                    $follower->is_following = in_array($follower->ma_nguoi_dung, $myFollowingIds);
                    return $follower;
                }
            );
        }

        return response()->json([
            'status' => 'success',
            'data' => $followers
        ]);
    }

    // public function followUser(Request $request, $id)
    // {

    //     $currentUser = $request->user(); // user hiện tại

    //     $targetUser = NguoiDung::find($id); // Kiểm tra người được theo dõi tồn tại

    //     if (!$targetUser) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Người dùng không tồn tại.'
    //         ], 404);
    //     }
    //     // kiểm tra: chặn việc theo dõi chính mình hoặc khi đang ở chính mình thì hiện nút khác
    //     if ($currentUser->ma_nguoi_dung == $id) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Bạn không thể tự theo dõi chính mình.'
    //         ], 400);
    //     }
    //     // Kiểm tra đã theo dõi chưa
    //     $isFollowing = $currentUser->dangTheoDoi()
    //         ->where('ma_nguoi_duoc_theo_doi', $id)
    //         ->exists();

    //     if ($isFollowing) {

    //         $currentUser->dangTheoDoi()->detach($id); // Nếu đã theo dõi thì unfollow
    //         $message = 'Đã bỏ theo dõi.';
    //         $status = 'unfollowed';
    //     } else {
    //         $currentUser->dangTheoDoi()->attach($id, [
    //             'trang_thai' => 1,
    //             'ngay_theo_doi' => now()
    //         ]);
    //         $message = 'Đã theo dõi thành công.';
    //         $status = 'followed';
    //     }
    //     return response()->json([
    //         'status' => 'success',
    //         'action' => $status, // frontend dùng để thay đổi nút theo dõi
    //         'message' => $message,
    //         'data' => [
    //             'follower_id' => $currentUser->ma_nguoi_dung,
    //             'following_id' => $targetUser->ma_nguoi_dung
    //         ]
    //     ]);
    // }


}
