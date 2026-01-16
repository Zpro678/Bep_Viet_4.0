<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DanhSachMuaSam;

class DanhSachMuaSamController extends Controller
{
    //
    // 46. GET /shopping-list: Lấy danh sách cần mua
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        // Lấy danh sách của user, kèm thông tin nguyên liệu (tên, ảnh...)
        $danhSach = DanhSachMuaSam::where('ma_nguoi_dung', $userId)
            ->with('nguyenLieu') // Load quan hệ để hiển thị tên nguyên liệu
            ->orderBy('trang_thai', 'asc') // Ưu tiên hiện món chưa mua (0) trước, đã mua (1) sau
            ->get();

        return response()->json([
            'message' => 'Lấy danh sách mua sắm thành công',
            'data' => $danhSach
        ]);
    }

    // 47. POST /shopping-list: Thêm nguyên liệu vào danh sách
    public function store(Request $request)
    {
        $request->validate([
            'ma_nguyen_lieu' => 'required|exists:nguyen_lieu,ma_nguyen_lieu', // Phải là ID nguyên liệu có thật
            'so_luong_can'   => 'required|numeric|min:0',
            'don_vi'         => 'required|string',
        ]);

        // Kiểm tra xem nguyên liệu này đã có trong danh sách cần mua chưa?
        // Nếu có rồi thì cộng dồn số lượng (Optional - tùy logic bạn muốn)
        // Ở đây mình làm đơn giản là thêm dòng mới.

        $item = DanhSachMuaSam::create([
            'ma_nguoi_dung'  => $request->user()->id,
            'ma_nguyen_lieu' => $request->input('ma_nguyen_lieu'),
            'so_luong_can'   => $request->input('so_luong_can'),
            'don_vi'         => $request->input('don_vi'),
            'trang_thai'     => 0 // Mặc định là 0 (Chưa mua)
        ]);

        return response()->json([
            'message' => 'Đã thêm vào giỏ đi chợ',
            'data' => $item
        ], 201);
    }

    // 48. PUT /shopping-list/{id}/status: Cập nhật trạng thái (Đã mua/Chưa mua)
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'trang_thai' => 'required|boolean' // Gửi lên true (1) hoặc false (0)
        ]);

        $item = DanhSachMuaSam::find($id);

        if (!$item) {
            return response()->json(['message' => 'Không tìm thấy mục này'], 404);
        }

        // BẢO MẬT: Kiểm tra quyền sở hữu
        if ($item->ma_nguoi_dung !== $request->user()->id) {
            return response()->json(['message' => 'Bạn không có quyền sửa mục này'], 403);
        }

        // Cập nhật trạng thái
        $item->trang_thai = $request->input('trang_thai');
        $item->save();

        return response()->json([
            'message' => 'Cập nhật trạng thái thành công',
            'data' => $item
        ]);
    }

    // DELETE /shopping-list/{id}: Xóa khỏi danh sách
    public function destroy(Request $request, $id)
    {
        $item = DanhSachMuaSam::find($id);

        if (!$item) {
            return response()->json(['message' => 'Không tìm thấy mục này'], 404);
        }

        // BẢO MẬT: Kiểm tra quyền sở hữu
        if ($item->ma_nguoi_dung !== $request->user()->id) {
            return response()->json(['message' => 'Bạn không có quyền xóa mục này'], 403);
        }

        $item->delete();

        return response()->json([
            'message' => 'Đã xóa khỏi danh sách mua sắm'
        ]);
    }
}
