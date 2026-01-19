<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\NguoiDung;

class AuthController extends Controller
{
    public function register(Request $r)
    {
        /// VALIDATE lại
        $data = $r->validate([
            'ten_dang_nhap' => 'required|unique:nguoi_dung',
            'email' => 'required|email|unique:nguoi_dung',
            'ho_ten' => 'required',
            'mat_khau' => 'required|min:6'
        ]);

        NguoiDung::dangKy($data);

        return response()->json(['message' => 'Đăng ký thành công']);
    }

    public function login(Request $request)
    {
        /// VALIDATE lại
        $request->validate([
            'email' => 'required|email',
            'mat_khau' => 'required|string'
        ]);

        $user = NguoiDung::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->mat_khau, $user->mat_khau)) {
            return response()->json([
                'message' => 'Email hoặc mật khẩu không đúng'
            ], 401);
        }

        return response()->json([
            'token' => $user->taoToken(),
            'user' => $user
        ]);
    }

    public function logout(Request $r)
    {
        $r->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Đăng xuất thành công'
        ]);
    }
}
