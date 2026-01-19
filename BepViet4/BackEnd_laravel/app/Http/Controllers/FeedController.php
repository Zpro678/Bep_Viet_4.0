<?php

namespace App\Http\Controllers;

use App\Models\NguoiDung;

class FeedController extends Controller
{
    // GET /users/{id}/feed
    public function feed($id)
    {
        $user = NguoiDung::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Người dùng không tồn tại'
            ], 404);
        }

        $feed = $user->feed();

        if ($feed->isEmpty()) {
            return response()->json([
                'message' => 'Chưa có bài viết từ người bạn theo dõi',
                'data' => []
            ]);
        }

        return response()->json($feed);
    }
}
