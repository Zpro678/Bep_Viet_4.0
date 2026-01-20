<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\CongThuc;
use App\Models\BaiViet;
use App\Models\BoSuuTap;
use App\Models\The;

class NguoiDung extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'nguoi_dung';
    protected $primaryKey = 'ma_nguoi_dung';
    public $timestamps = false; // Tài liệu dùng ngay_tao, không dùng created_at/updated_at chuẩn

    protected $fillable = [
        'ten_dang_nhap',
        'email',
        'ho_ten',
        'mat_khau',
        'ngay_sinh',
        'gioi_tinh',
        'vai_tro'
    ];

    protected $hidden = [
        'mat_khau', // [cite: 359]
    ];

    // Password field mặc định của Laravel là 'password', cần override nếu dùng 'mat_khau'
    public function getAuthPassword()
    {
        return $this->mat_khau;
    }

    // Quan hệ 1-N: Người dùng có nhiều Công thức [cite: 302]
    public function congThuc()
    {
        return $this->hasMany(CongThuc::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }

    // Quan hệ 1-N: Người dùng có nhiều Bài viết [cite: 304]
    public function baiViet()
    {
        return $this->hasMany(BaiViet::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }

    // Quan hệ 1-N: Bộ sưu tập [cite: 323]
    public function boSuuTap()
    {
        return $this->hasMany(BoSuuTap::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }

    // hasMany: đánh giá
    public function danhGia()
    {
        return $this->hasMany(DanhGia::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }

    // hasMany: bình luận về bài viết
    public function binhLuanBaiViet()
    {
        return $this->hasMany(BinhLuanBaiViet::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }


    ///////////////
    // Công thức đã đăng
    public function recipes()
    {
        return $this->hasMany(CongThuc::class, 'ma_nguoi_dung');
    }

    // Người đang theo dõi user này
    public function followers()
    {
        return $this->belongsToMany(
            NguoiDung::class,
            'theo_doi',
            'ma_nguoi_duoc_theo_doi',
            'ma_nguoi_theo_doi'
        );
    }

    // User đang theo dõi ai
    public function following()
    {
        return $this->belongsToMany(
            NguoiDung::class,
            'theo_doi',
            'ma_nguoi_theo_doi',
            'ma_nguoi_duoc_theo_doi'
        );
    }

    ///////////////////////////////////
    // đăng ký
    public static function dangKy($data)
    {
        return self::create([
            'ten_dang_nhap' => $data['ten_dang_nhap'],
            'email'        => $data['email'],
            'ho_ten'       => $data['ho_ten'],
            'mat_khau'     => bcrypt($data['mat_khau']),
            'vai_tro'      => 'member'
        ]);
    }

    // TOKEN
    public function taoToken()
    {
        return $this->createToken('api-token')->plainTextToken;
    }

    // CẬP NHẬT HỒ SƠ
    public function capNhatHoSo($data)
    {
        return $this->update($data);
    }

    // FEED
    public function feed()
    {
        $ids = TheoDoi::where('ma_nguoi_theo_doi', $this->ma_nguoi_dung)
            ->pluck('ma_nguoi_duoc_theo_doi');

        return CongThuc::whereIn('ma_nguoi_dung', $ids)
            ->with([
                'tacGia:ma_nguoi_dung,ho_ten',
                'danhMuc:ma_danh_muc,ten_danh_muc',
                'vungMien:ma_vung_mien,ten_vung_mien'
            ])
            ->orderByDesc('ngay_tao')
            ->paginate(10);
    }

    // Tổng quan
    public static function getOverviewById(int $id): ?array
    {
        $user = self::find($id);

        if (!$user) {
            return null;
        }

        return [
            'user_id' => $user->ma_nguoi_dung,
            'recipes_count' => $user->recipes()->count(),
            'followers_count' => $user->followers()->count(),
            'following_count' => $user->following()->count(),
            'joined_at' => $user->created_at?->format('Y-m-d'),
            'role' => $user->vai_tro ?? 'member'
        ];
    }
}
