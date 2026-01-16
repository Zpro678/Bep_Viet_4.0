<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\CongThuc;
use App\Models\BaiViet;
use App\Models\BoSuuTap;
use App\Models\The;
class NguoiDung extends Authenticatable
{
    use Notifiable;

    protected $table = 'NguoiDung';
    protected $primaryKey = 'ma_nguoi_dung';
    public $timestamps = false; // Tài liệu dùng ngay_tao, không dùng created_at/updated_at chuẩn

    protected $fillable = [
        'ten_dang_nhap', 'email', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'vai_tro'
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
}