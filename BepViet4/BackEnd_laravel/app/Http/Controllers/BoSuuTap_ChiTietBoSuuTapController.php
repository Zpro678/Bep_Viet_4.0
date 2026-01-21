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
       
        $boSuuTaps = $user->boSuuTap()
            ->withCount('congThucs')
            ->with(['congThucs' => function ($query) {
               
                $query->orderBy('chi_tiet_bo_suu_tap.ngay_them', 'desc')
                      ->select('cong_thuc.ma_cong_thuc', 'cong_thuc.ten_mon')
                      ->with('hinhAnh'); 
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        
        $boSuuTaps->transform(function ($bst) {
            $firstRecipe = $bst->congThucs->first(); 
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

       
        $user = $request->user();

        try {
         
            $boSuuTap = BoSuuTap::create([
                'ten_bo_suu_tap' => $request->ten_bo_suu_tap,
                'ma_nguoi_dung'  => $user->ma_nguoi_dung, 
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

    
    public function updateName(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'ten_bo_suu_tap' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()->first()], 422);
        }

        $user = $request->user();

        
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

   
    public function delete(Request $request, $id) 
    {
        $user = $request->user();

        $boSuuTap = $user->boSuuTap()->find($id);

        if (!$boSuuTap) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy bộ sưu tập hoặc bạn không có quyền xóa'
            ], 404);
        }

        
        ChiTietBoSuuTap::where('ma_bo_suu_tap', $id)->delete();
        
       
        $boSuuTap->delete();

        return response()->json([
            'status' => true,
            'message' => 'Đã xóa bộ sưu tập thành công'
        ], 200);
    }

   
    public function show($id)
    {
        $boSuuTap = BoSuuTap::with('congThucs.hinhAnh')->find($id);

        if (!$boSuuTap) {
            return response()->json(['message' => 'Không tìm thấy bộ sưu tập'], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Lấy dữ liệu thành công',
            'data' => $boSuuTap
        ], 200);
    }

   
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
        
       
        $boSuuTap = $user->boSuuTap()->find($id);
        
        if (!$boSuuTap) {
            return response()->json(['status' => false, 'message' => 'Bộ sưu tập không tồn tại hoặc không chính chủ'], 404);
        }

       
        $exists = $boSuuTap->congThucs()
                           ->where('chi_tiet_bo_suu_tap.ma_cong_thuc', $request->ma_cong_thuc)
                           ->exists();
        
        if ($exists) {
            return response()->json(['status' => false, 'message' => 'Món này đã có trong bộ sưu tập'], 409);
        }

       
        $boSuuTap->congThucs()->attach($request->ma_cong_thuc, [
            'ngay_them' => now(),
            'ghi_chu'   => $request->ghi_chu
        ]);

        return response()->json(['status' => true, 'message' => 'Thêm thành công'], 201);
    }

    public function removeRecipe(Request $request, $id, $recipeId)
    {
        $user = $request->user();

      
        $boSuuTap = $user->boSuuTap()->find($id);

        if (!$boSuuTap) {
            return response()->json(['status' => false, 'message' => 'Không tìm thấy bộ sưu tập'], 404);
        }

      
        $result = $boSuuTap->congThucs()->detach($recipeId);

        if ($result === 0) {
            return response()->json(['status' => false, 'message' => 'Món ăn không tồn tại trong danh sách'], 404);
        }

        return response()->json(['status' => true, 'message' => 'Đã xóa món ăn khỏi bộ sưu tập'], 200);
    }
}