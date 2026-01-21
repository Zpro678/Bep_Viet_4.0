<?php

namespace App\Http\Controllers;

use App\Models\NguoiDung;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Exception;
class AuthController extends Controller
{
    public function register(Request $request)
    {
        
        $validator = Validator::make($request->all(), [
            'ten_dang_nhap' => 'required|string|max:100|unique:nguoi_dung,ten_dang_nhap',
            'email'         => 'required|email|max:50|unique:nguoi_dung,email',
            'mat_khau'      => 'required|string|min:6',
            'ho_ten'        => 'required|string|max:100',
            'ngay_sinh'     => 'required|date|before:today', 
            'gioi_tinh'     => ['required', Rule::in(['Nam', 'Nữ', 'Khác'])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            
            $user = NguoiDung::create([
                'ten_dang_nhap' => $request->ten_dang_nhap,
                'email'         => $request->email,
                'mat_khau'      => Hash::make($request->mat_khau), 
                'ho_ten'        => $request->ho_ten,
                'ngay_sinh'     => $request->ngay_sinh,
                'gioi_tinh'     => $request->gioi_tinh,
                'vai_tro'       => 'member', 
            ]);

            //Tạo Token (Sanctum) trả về luôn cho người dùng
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status'  => 'success',
                'message' => 'Đăng ký thành công',
                'data'    => [
                    'user'         => $user,
                    'access_token' => $token,
                    'token_type'   => 'Bearer',
                ]
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Lỗi server khi đăng ký',
                'detail'  => $e->getMessage()
            ], 500);
        }
    }
    public function login(Request $request)
    {
    
        $validator = Validator::make($request->all(), [
            'ten_dang_nhap' => 'required|string|max:100', 
            'mat_khau' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        
        $user = NguoiDung::where('ten_dang_nhap', $request->ten_dang_nhap)->first();

        
        if (!$user || !Hash::check($request->mat_khau, $user->mat_khau)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Thông tin đăng nhập không chính xác (Email hoặc Mật khẩu sai).'
            ], 401); 
        }

        $user->tokens()->delete(); 

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Đăng nhập thành công!',
            'data' => [
                'user' => $user, 
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]
        ], 200);
    }
    
    public function logout(Request $request)
    {

        $user = $request->user(); 

        $user->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Đăng xuất thành công, Token đã bị hủy.'
        ], 200);
    }
}