<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\NguoiDung;

class TheoDoiController extends Controller
{

    
    public function follow(Request $request, $id)
    {
        $currentUser = $request->user();
        
        if ($currentUser->ma_nguoi_dung == $id) {
            return response()->json(['message' => 'Không thể theo dõi chính mình'], 400);
        }
        
        $targetUser = NguoiDung::find($id);
        if (!$targetUser) {
            return response()->json(['message' => 'Người dùng không tồn tại'], 404);
        }

        $currentUser->dangTheoDoi()->syncWithoutDetaching([
            $id => ['trang_thai' => 1]
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Đã theo dõi thành công.'
        ]);
    }

    public function unfollow(Request $request, $id)
    {
        $currentUser = $request->user();
    
        $detached = $currentUser->dangTheoDoi()->detach($id);

        if ($detached > 0) {
            return response()->json([
                'status' => 'success',
                'message' => 'Đã hủy theo dõi.'
            ]);
        } else {
            return response()->json([
                'status' => 'success', 
                'message' => 'Bạn chưa theo dõi người này nên không thể hủy.'
            ]);
        }
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
  function ($follower) use ($myFollowingIds) 
            {
                $follower->is_following = in_array($follower->ma_nguoi_dung, $myFollowingIds);
                return $follower;
            });
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
