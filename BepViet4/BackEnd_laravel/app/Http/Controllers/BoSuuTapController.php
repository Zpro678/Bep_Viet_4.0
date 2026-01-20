<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BoSuuTap;
use App\Exceptions\BusinessException;
use Throwable;

class BoSuuTapController extends Controller
{
    // 28. GET /collections:
    public function index(Request $request)
    {
        try {
            $user = $request->user();

            $data = BoSuuTap::danhSachCuaUser($user->ma_nguoi_dung);

            return response()->json([
                'status' => 'success',
                'data' => $data
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống'
            ], 500);
        }
    }

    // 29. POST /collections:
    public function store(Request $request)
    {
        try {
            $user = $request->user();

            $validated = $request->validate([
                'ten_bo_suu_tap' => 'required|string|max:255'
            ]);

            $collection = BoSuuTap::taoBoSuuTap(
                $user->ma_nguoi_dung,
                $validated
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Tạo bộ sưu tập thành công',
                'data' => $collection
            ], 201);

        } catch (BusinessException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], $e->getStatus());

        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống'
            ], 500);
        }
    }
}
