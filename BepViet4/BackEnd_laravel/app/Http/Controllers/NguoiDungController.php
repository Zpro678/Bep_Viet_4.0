<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NguoiDung;
use App\Models\CongThuc;

class NguoiDungController extends Controller
{
    // THÔNG TIN CÁ NHÂN USER
    public function profile(Request $r)
    {
        return $r->user();
    }

    // CẬP NHẬT HỒ SƠ
    public function update(Request $request)
    {
        $request->user()->capNhatHoSo(
            $request->only('ho_ten', 'ngay_sinh', 'gioi_tinh')
        );

        return response()->json([
            'message' => 'Cập nhật thành công'
        ]);
    }

    // PROFILE 
    public function show($id)
    {
        return NguoiDung::select(
            'ma_nguoi_dung', 'ho_ten', 'gioi_tinh', 'ngay_sinh'
        )->findOrFail($id);
    }

    // CT CỦA USER 
    public function recipes($id)
    {
        return CongThuc::where('ma_nguoi_dung', $id)
            ->orderByDesc('ngay_tao')
            ->paginate(10); // số bản ghi theo mỗi trang(phân trang + có tổng số trang)
    }

    // TỔNG QUAN NGƯỜI DÙNG
    public function overview($id)
    {
        $overview = NguoiDung::getOverviewById($id);

        if (!$overview) {
            return response()->json([
                'message' => 'Người dùng không tồn tại'
            ], 404);
        }

        return response()->json($overview);
    }

    // FEED
    public function feed(Request $request)
    {
        return response()->json(
            $request->user()->feed()
        );
    }
}
