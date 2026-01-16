<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ThucDon;

class ThucDonController extends Controller
{
    //
    // 43. GET /meal-plans: Xem lịch ăn uống (có lọc theo ngày)
    public function index(Request $request)
    {
        // Lấy ID người dùng hiện tại từ Token
        $userId = $request->user()->id;

        // Bắt đầu truy vấn
        $query = ThucDon::where('ma_nguoi_dung', $userId)
            ->with('congThuc'); // Load kèm thông tin món ăn để hiển thị tên, ảnh...

        // Lọc theo ngày bắt đầu (from_date)
        if ($request->has('from_date')) {
            $query->whereDate('ngay_an', '>=', $request->from_date);
        }

        // Lọc theo ngày kết thúc (to_date)
        if ($request->has('to_date')) {
            $query->whereDate('ngay_an', '<=', $request->to_date);
        }

        // Sắp xếp theo ngày ăn tăng dần
        $thucDon = $query->orderBy('ngay_an', 'asc')->get();

        return response()->json([
            'message' => 'Lấy danh sách thực đơn thành công',
            'data' => $thucDon
        ]);
    }

    // 44. POST /meal-plans: Thêm món vào thực đơn
    public function store(Request $request)
    {
        // Validate dữ liệu
        $request->validate([
            'ma_cong_thuc' => 'required|exists:cong_thuc,ma_cong_thuc', // Phải là ID món ăn có thật
            'ngay_an'      => 'required|date', // Định dạng YYYY-MM-DD
            'buoi'         => 'required|string', // Sáng, Trưa, Chiều, Tối...
        ]);

        // Tạo mới bản ghi
        $thucDon = ThucDon::create([
            'ma_nguoi_dung' => $request->user()->id, // Tự động lấy ID người đang login
            'ma_cong_thuc'  => $request->input('ma_cong_thuc'),
            'ngay_an'       => $request->input('ngay_an'),
            'buoi'          => $request->input('buoi'),
        ]);

        return response()->json([
            'message' => 'Đã thêm món vào thực đơn',
            'data' => $thucDon
        ], 201);
    }

    // 45. DELETE /meal-plans/{id}: Xóa món khỏi thực đơn
    public function destroy(Request $request, $id)
    {
        // Tìm món trong thực đơn theo ID
        $thucDon = ThucDon::find($id);

        if (!$thucDon) {
            return response()->json(['message' => 'Không tìm thấy mục thực đơn này'], 404);
        }

        // BẢO MẬT: Kiểm tra xem món này có phải của người đang login không?
        // Tránh trường hợp ông A xóa lịch ăn của ông B
        if ($thucDon->ma_nguoi_dung !== $request->user()->id) {
            return response()->json(['message' => 'Bạn không có quyền xóa mục này'], 403);
        }

        $thucDon->delete();

        return response()->json([
            'message' => 'Đã xóa món khỏi thực đơn thành công'
        ], 200);
    }
}
