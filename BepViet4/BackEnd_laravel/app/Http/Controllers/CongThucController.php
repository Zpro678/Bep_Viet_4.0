<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\CongThuc;

class CongThucController extends Controller
{
    // DS
    public function index(Request $request)
    {
         $filter = [
            'ten'     => $request->query('ten'),      // tên món
            'do_kho'  => $request->query('do_kho'),   // độ khó
        ];

        $recipes = CongThuc::with([
                'tacGia:ma_nguoi_dung,ten_nguoi_dung',
                'danhMuc:ma_danh_muc,ten_danh_muc',
                'vungMien:ma_vung_mien,ten_vung_mien'
            ])
            ->when($filter['ten'], function ($q, $v) {
                $q->where('ten_mon', 'like', "%$v%");
            })
            ->when($filter['do_kho'], function ($q, $v) {
                $q->where('do_kho', $v);
            })
            ->orderByDesc('ngay_tao')
            ->paginate(10);

        return response()->json([
            'status' => true,
            'message' => 'Danh sách công thức',
            'data' => $recipes
        ]);
    }

    // TẠO CT MỚI
    public function store(Request $request)
    {
        // VALIDATE LẠI
        $validator = Validator::make($request->all(), [
            'ten_mon'       => 'required|string|max:255',
            'mo_ta'         => 'nullable|string',
            'ma_danh_muc'   => 'required|integer|exists:danh_muc,ma_danh_muc',
            'ma_vung_mien'  => 'required|integer|exists:vung_mien,ma_vung_mien',
            'thoi_gian_nau' => 'required|integer|min:1',
            'khau_phan'     => 'required|integer|min:1',
            'do_kho'        => 'required|integer|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $userId = $request->user()->ma_nguoi_dung;

        $congThuc = CongThuc::taoCongThuc($userId, $validator->validated());

        return response()->json([
            'status' => true,
            'message' => 'Tạo công thức thành công',
            'data' => $congThuc
        ], 201);
    }
}
