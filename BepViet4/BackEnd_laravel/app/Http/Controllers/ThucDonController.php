<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ThucDon;

class ThucDonController extends Controller
{
    //
    public function iindex()
    {
        $thucDon = ThucDon::all(); // Lấy tất cả thực đơn
        return response()->json([
            'message' => 'Lấy danh sách thực đơn thành công',
            'data' => $thucDon // Trả về mảng dữ liệu
        ]);
    }
    // 43. GET /meal-plans: Xem lịch ăn uống (có lọc theo ngày)
    public function index(Request $request)
    {
        $userId = $request->user()->ma_nguoi_dung;

        // SỬ DỤNG JOIN
        $query = ThucDon::query()
            ->join('cong_thuc', 'thuc_don.ma_cong_thuc', '=', 'cong_thuc.ma_cong_thuc')
            ->where('thuc_don.ma_nguoi_dung', $userId)
            // CHÚ Ý: Phải select rõ ràng để tránh trùng tên cột (ví dụ id, ngay_tao)
            ->select(
                'thuc_don.*',
                'cong_thuc.ten_mon',
                'cong_thuc.mo_ta'
            );

        if ($request->has('from_date')) {
            $query->whereDate('thuc_don.ngay_an', '>=', $request->from_date);
        }

        if ($request->has('to_date')) {
            $query->whereDate('thuc_don.ngay_an', '<=', $request->to_date);
        }

        $thucDon = $query->orderBy('thuc_don.ngay_an', 'asc')->get();

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
            'ngay_an' => 'required|date', // Định dạng YYYY-MM-DD
            'buoi' => 'required|string', // Sáng, Trưa, Chiều, Tối...
        ]);

        // Tạo mới bản ghi
        $thucDon = ThucDon::create([
            'ma_nguoi_dung' => $request->user()->ma_nguoi_dung, // Tự động lấy ID người đang login
            // 'ma_nguoi_dung' => $request->input('ma_nguoi_dung'), TestAPI
            'ma_cong_thuc' => $request->input('ma_cong_thuc'),
            'ngay_an' => $request->input('ngay_an'),
            'buoi' => $request->input('buoi'),
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
        if ($thucDon->ma_nguoi_dung !== $request->user()->ma_nguoi_dung) {
            return response()->json(['message' => 'Bạn không có quyền xóa mục này'], 403);
        }

        $thucDon->delete();

        return response()->json([
            'message' => 'Đã xóa món khỏi thực đơn thành công'
        ], 200);
    }
}