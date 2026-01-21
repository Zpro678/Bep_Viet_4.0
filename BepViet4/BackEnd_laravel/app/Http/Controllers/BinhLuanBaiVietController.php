<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BinhLuanBaiViet;
use App\Models\BaiViet;
use Illuminate\Support\Facades\Validator;

class BinhLuanBaiVietController extends Controller
{
    // ==========================================================
    // PHẦN 1: GET (LẤY DỮ LIỆU) - PUBLIC
    // ==========================================================

    // 1. Lấy danh sách bình luận (GỐC) của một bài viết (Dùng cho phân trang)
    public function layBinhLuanBaiViet($id)
    {
        $baiViet = BaiViet::find($id);
        if (!$baiViet) {
            return response()->json(['message' => 'Bài viết không tồn tại'], 404);
        }

        $dsBinhLuan = BinhLuanBaiViet::where('ma_bai_viet', $id)
            ->whereNull('ma_binh_luan_cha') // Chỉ lấy comment gốc
            ->with(['nguoiDung:ma_nguoi_dung,ho_ten,anh_dai_dien'])
            ->withCount('traLoi') // Đếm số reply
            ->orderByDesc('ngay_gui')
            ->paginate(10);

        return response()->json([
            'message' => 'Lấy danh sách bình luận thành công',
            'data' => $dsBinhLuan
        ], 200);
    }

    // 2. Lấy các câu trả lời (REPLY) của một comment cha
    public function layCauTraLoi($id)
    {
        $binhLuanCha = BinhLuanBaiViet::find($id);
        if (!$binhLuanCha) {
            return response()->json(['message' => 'Bình luận không tồn tại'], 404);
        }

        $cauTraLoi = BinhLuanBaiViet::where('ma_binh_luan_cha', $id)
            ->with(['nguoiDung:ma_nguoi_dung,ho_ten,anh_dai_dien'])
            // --- THÊM DÒNG NÀY ---
            ->withCount('traLoi') // Đếm xem comment con này có comment cháu không
            // ---------------------
            ->orderBy('ngay_gui', 'asc')
            ->get();

        return response()->json([
            'message' => 'Lấy câu trả lời thành công',
            'data' => $cauTraLoi
        ], 200);
    }

    // 3. Xem chi tiết 1 bình luận
    public function layBinhLuan($id)
    {
        $binhLuan = BinhLuanBaiViet::with(['nguoiDung:ma_nguoi_dung,ho_ten,anh_dai_dien'])
            ->find($id);

        if (!$binhLuan) {
            return response()->json(['message' => 'Không tìm thấy bình luận'], 404);
        }

        return response()->json(['data' => $binhLuan], 200);
    }

    // 4. Lịch sử bình luận của user
    public function lichSuBinhLuan(Request $request)
    {
        $user = $request->user();
        $lichSu = BinhLuanBaiViet::where('ma_nguoi_dung', $user->ma_nguoi_dung)
            ->with(['baiViet:ma_bai_viet,tieu_de,hinh_anh_dai_dien'])
            ->orderByDesc('ngay_gui')
            ->paginate(20);

        return response()->json([
            'message' => 'Lịch sử bình luận',
            'data' => $lichSu
        ], 200);
    }

    // ==========================================================
    // PHẦN 2: POST/PUT/DELETE (TƯƠNG TÁC) - CẦN LOGIN
    // ==========================================================

    // 5. Gửi bình luận mới (Cấp 1)
    public function store(Request $request, $id)
    {
        $baiViet = BaiViet::find($id);
        if (!$baiViet) {
            return response()->json(['message' => 'Bài viết không tồn tại'], 404);
        }

        $validator = Validator::make($request->all(), [
            'noi_dung' => 'required|string|max:1000',
        ], [
            'noi_dung.required' => 'Nội dung bình luận không được để trống',
            'noi_dung.max' => 'Bình luận quá dài'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $binhLuan = BinhLuanBaiViet::create([
            'noi_dung' => $request->noi_dung,
            'ma_nguoi_dung' => $request->user()->ma_nguoi_dung,
            'ma_bai_viet' => $id,
            'ma_binh_luan_cha' => null, // Quan trọng: Đây là null
            'ngay_gui' => now(),
        ]);

        // Load thông tin user để trả về frontend hiển thị ngay
        $binhLuan->load('nguoiDung:ma_nguoi_dung,ho_ten,anh_dai_dien');
        $binhLuan->tra_loi_count = 0; // Gán mặc định số reply là 0

        return response()->json([
            'message' => 'Gửi bình luận thành công',
            'data' => $binhLuan
        ], 201);
    }

    // 6. Trả lời bình luận (Reply)
    public function traLoiBinhLuan(Request $request, $id)
    {
        $binhLuanCha = BinhLuanBaiViet::find($id);
        if (!$binhLuanCha) {
            return response()->json(['message' => 'Bình luận gốc không tồn tại'], 404);
        }

        $validator = Validator::make($request->all(), [
            'noi_dung' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $reply = BinhLuanBaiViet::create([
            'noi_dung' => $request->noi_dung,
            'ma_nguoi_dung' => $request->user()->ma_nguoi_dung,
            'ma_bai_viet' => $binhLuanCha->ma_bai_viet,
            'ma_binh_luan_cha' => $id,
            'ngay_gui' => now(),
        ]);

        $reply->load('nguoiDung:ma_nguoi_dung,ho_ten,anh_dai_dien');
        
        // --- THÊM DÒNG NÀY ---
        // Gán mặc định tra_loi_count = 0 để frontend không bị lỗi undefined khi vừa comment xong
        $reply->tra_loi_count = 0; 
        // ---------------------

        return response()->json([
            'message' => 'Trả lời bình luận thành công',
            'data' => $reply
        ], 201);
    }

    // 7. Sửa bình luận
    public function suaBinhLuan(Request $request, $id)
    {
        $binhLuan = BinhLuanBaiViet::find($id);

        if (!$binhLuan) {
            return response()->json(['message' => 'Không tìm thấy bình luận'], 404);
        }

        // Kiểm tra quyền: Chỉ chủ bình luận mới được sửa
        if ($binhLuan->ma_nguoi_dung !== $request->user()->ma_nguoi_dung) {
            return response()->json(['message' => 'Bạn không có quyền sửa bình luận này'], 403);
        }

        $validator = Validator::make($request->all(), [
            'noi_dung' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $binhLuan->update([
            'noi_dung' => $request->noi_dung
        ]);
        
        // Trả về data mới nhất kèm thông tin user để cập nhật UI
        $binhLuan->load('nguoiDung:ma_nguoi_dung,ho_ten,anh_dai_dien');

        return response()->json([
            'message' => 'Cập nhật bình luận thành công',
            'data' => $binhLuan
        ], 200);
    }

    // 8. Xóa bình luận
    public function xoaBinhLuan(Request $request, $id)
    {
        $binhLuan = BinhLuanBaiViet::find($id);

        if (!$binhLuan) {
            return response()->json(['message' => 'Không tìm thấy bình luận'], 404);
        }

        if ($binhLuan->ma_nguoi_dung !== $request->user()->ma_nguoi_dung) {
            return response()->json(['message' => 'Bạn không có quyền xóa bình luận này'], 403);
        }
        
        // Tùy chọn: Xóa luôn các bình luận con nếu xóa bình luận cha
        // BinhLuanBaiViet::where('ma_binh_luan_cha', $id)->delete();

        $binhLuan->delete();

        return response()->json(['message' => 'Xóa bình luận thành công'], 200);
    }
}