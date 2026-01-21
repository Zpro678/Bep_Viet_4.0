<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BoSuuTap; 
use App\Models\ChiTietBoSuuTap;
use Illuminate\Support\Facades\Validator;

class BoSuuTap_ChiTietBoSuuTapController extends Controller
{
    /**
     * Lấy danh sách bộ sưu tập của User đang đăng nhập
     */
   public function index(Request $request)
{
    $user = $request->user();

    if (!$user) {
        return response()->json(['status' => false, 'message' => 'Vui lòng đăng nhập'], 401);
    }

    try {
        // 1. Lấy danh sách BST kèm theo công thức (để lấy ảnh)
        $boSuuTaps = $user->boSuuTap()
            ->withCount('congThucs')
            ->with(['congThucs' => function ($query) {
                // Sắp xếp theo ngày thêm vào BST mới nhất để lấy ảnh mới nhất
                // Lưu ý: bảng trung gian là chi_tiet_bo_suu_tap
                $query->orderBy('chi_tiet_bo_suu_tap.ngay_them', 'desc')
                      ->select('cong_thuc.ma_cong_thuc', 'cong_thuc.ten_mon') // Chỉ lấy cột cần thiết cho nhẹ
                      ->with('hinhAnh'); // Eager load bảng hinh_anh
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        // 2. Xử lý dữ liệu: Lấy ảnh từ công thức đầu tiên gán vào biến 'hinh_anh_bia'
        $boSuuTaps->transform(function ($bst) {
            $firstRecipe = $bst->congThucs->first(); // Lấy công thức mới nhất
            $image = null;

            if ($firstRecipe && $firstRecipe->hinhAnh->isNotEmpty()) {
                $image = $firstRecipe->hinhAnh->first()->duong_dan;
            }

            // Gán thêm field hinh_anh_bia vào object trả về
            $bst->hinh_anh_bia = $image;
            
            // Xóa mảng congThucs đi cho response nhẹ, vì list bên ngoài không cần chi tiết món
            unset($bst->congThucs); 
            
            return $bst;
        });

        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách thành công',
            'data' => $boSuuTaps
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Lỗi Server: ' . $e->getMessage()
        ], 500);
    }
}

    /**
     * Tạo bộ sưu tập mới cho User hiện tại
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ten_bo_suu_tap' => 'required|string|max:255',
        ], [
            'ten_bo_suu_tap.required' => 'Vui lòng nhập tên bộ sưu tập',
            'ten_bo_suu_tap.max'      => 'Tên bộ sưu tập không quá 255 ký tự',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => false,
                'message' => 'Lỗi dữ liệu đầu vào',
                'errors'  => $validator->errors()
            ], 422);
        }

        // Lấy User hiện tại
        $user = $request->user();

        try {
            // Tạo mới và gán ma_nguoi_dung tự động
            $boSuuTap = BoSuuTap::create([
                'ten_bo_suu_tap' => $request->ten_bo_suu_tap,
                'ma_nguoi_dung'  => $user->ma_nguoi_dung, // Lấy ID từ token
            ]);

            return response()->json([
                'status'  => true,
                'message' => 'Tạo bộ sưu tập thành công',
                'data'    => $boSuuTap
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Lỗi Server: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Đổi tên bộ sưu tập (Chỉ chủ sở hữu mới đổi được)
     */
    public function updateName(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'ten_bo_suu_tap' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()->first()], 422);
        }

        $user = $request->user();

        // Tìm bộ sưu tập nhưng PHẢI thuộc về user này
        // Cách này đảm bảo User A không sửa được của User B dù biết ID
        $boSuuTap = $user->boSuuTap()->find($id);

        if (!$boSuuTap) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy bộ sưu tập hoặc bạn không có quyền sửa'
            ], 404);
        }

        $boSuuTap->ten_bo_suu_tap = $request->ten_bo_suu_tap;
        $boSuuTap->save();

        return response()->json([
            'status' => true,
            'message' => 'Đổi tên thành công',
            'data' => $boSuuTap
        ], 200);
    }

    /**
     * Xóa bộ sưu tập (Chỉ chủ sở hữu mới xóa được)
     */
    public function delete(Request $request, $id) // Thêm Request để lấy user
    {
        $user = $request->user();

        // Tìm bộ sưu tập thuộc quyền sở hữu của user
        $boSuuTap = $user->boSuuTap()->find($id);

        if (!$boSuuTap) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy bộ sưu tập hoặc bạn không có quyền xóa'
            ], 404);
        }

        // Xóa chi tiết trước
        ChiTietBoSuuTap::where('ma_bo_suu_tap', $id)->delete();
        
        // Xóa bộ sưu tập
        $boSuuTap->delete();

        return response()->json([
            'status' => true,
            'message' => 'Đã xóa bộ sưu tập thành công'
        ], 200);
    }

    /**
     * Xem chi tiết (Có thể cho phép xem của người khác hoặc không tùy logic)
     * Ở đây mình để logic: Ai cũng xem được nếu có ID (Public)
     */
    public function show($id)
    {
        $boSuuTap = BoSuuTap::with('congThucs')->find($id);

        if (!$boSuuTap) {
            return response()->json(['message' => 'Không tìm thấy bộ sưu tập'], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Lấy dữ liệu thành công',
            'data' => $boSuuTap
        ], 200);
    }

    /**
     * Thêm món ăn vào bộ sưu tập (Chỉ chủ sở hữu mới thêm được)
     */
    public function addRecipe(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'ma_cong_thuc' => 'required|integer|exists:cong_thuc,ma_cong_thuc',
            'ghi_chu'      => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()->first()], 422);
        }

        $user = $request->user();
        
        // Kiểm tra quyền sở hữu bộ sưu tập
        $boSuuTap = $user->boSuuTap()->find($id);
        
        if (!$boSuuTap) {
            return response()->json(['status' => false, 'message' => 'Bộ sưu tập không tồn tại hoặc không chính chủ'], 404);
        }

        // Kiểm tra trùng lặp món ăn
        $exists = $boSuuTap->congThucs()
                           ->where('chi_tiet_bo_suu_tap.ma_cong_thuc', $request->ma_cong_thuc)
                           ->exists();
        
        if ($exists) {
            return response()->json(['status' => false, 'message' => 'Món này đã có trong bộ sưu tập'], 409);
        }

        // Thêm vào
        $boSuuTap->congThucs()->attach($request->ma_cong_thuc, [
            'ngay_them' => now(),
            'ghi_chu'   => $request->ghi_chu
        ]);

        return response()->json(['status' => true, 'message' => 'Thêm thành công'], 201);
    }

    /**
     * Xóa món ăn khỏi bộ sưu tập (Chỉ chủ sở hữu)
     */
    public function removeRecipe(Request $request, $id, $recipeId)
    {
        $user = $request->user();

        // Kiểm tra quyền sở hữu
        $boSuuTap = $user->boSuuTap()->find($id);

        if (!$boSuuTap) {
            return response()->json(['status' => false, 'message' => 'Không tìm thấy bộ sưu tập'], 404);
        }

        // Xóa liên kết
        $result = $boSuuTap->congThucs()->detach($recipeId);

        if ($result === 0) {
            return response()->json(['status' => false, 'message' => 'Món ăn không tồn tại trong danh sách'], 404);
        }

        return response()->json(['status' => true, 'message' => 'Đã xóa món ăn khỏi bộ sưu tập'], 200);
    }
}