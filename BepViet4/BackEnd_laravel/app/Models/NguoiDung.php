<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
<<<<<<< HEAD
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
=======
>>>>>>> 2a0fd928dbc5662ec43f263e0739c16ae8294922
use App\Models\CongThuc;
use App\Models\BaiViet;
use App\Models\BoSuuTap;
use App\Models\The;
class NguoiDung extends Authenticatable
{
<<<<<<< HEAD
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'nguoi_dung';
    protected $primaryKey = 'ma_nguoi_dung';
    public $timestamps = false; 

    protected $fillable = [
        'ten_dang_nhap', 'email','mat_khau', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'vai_tro'
    ];

    protected $hidden = [
        'mat_khau',
    ];

=======
    use Notifiable;

    protected $table = 'nguoi_dung';
    protected $primaryKey = 'ma_nguoi_dung';
    public $timestamps = false; // Tài liệu dùng ngay_tao, không dùng created_at/updated_at chuẩn

    protected $fillable = [
        'ten_dang_nhap', 'email', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'vai_tro'
    ];

    protected $hidden = [
        'mat_khau', // [cite: 359]
    ];

    // Password field mặc định của Laravel là 'password', cần override nếu dùng 'mat_khau'
>>>>>>> 2a0fd928dbc5662ec43f263e0739c16ae8294922
    public function getAuthPassword()
    {
        return $this->mat_khau;
    }
<<<<<<< HEAD
=======

    // Quan hệ 1-N: Người dùng có nhiều Công thức [cite: 302]
>>>>>>> 2a0fd928dbc5662ec43f263e0739c16ae8294922
    public function congThuc()
    {
        return $this->hasMany(CongThuc::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }

<<<<<<< HEAD
=======
    // Quan hệ 1-N: Người dùng có nhiều Bài viết [cite: 304]
>>>>>>> 2a0fd928dbc5662ec43f263e0739c16ae8294922
    public function baiViet()
    {
        return $this->hasMany(BaiViet::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }

<<<<<<< HEAD
=======
    // Quan hệ 1-N: Bộ sưu tập [cite: 323]
>>>>>>> 2a0fd928dbc5662ec43f263e0739c16ae8294922
    public function boSuuTap()
    {
        return $this->hasMany(BoSuuTap::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }
<<<<<<< HEAD

    public function nguoiTheoDoi()
    {
        return $this->belongsToMany(
            NguoiDung::class, 
            'theo_doi', 
            'ma_nguoi_duoc_theo_doi', // Khóa ngoại của người dùng hiện tại
            'ma_nguoi_theo_doi'       // Khóa ngoại của người đang follow mình
        )->wherePivot('trang_thai', 1); // 
    }
    public function dangTheoDoi()
    {
        return $this->belongsToMany(
            NguoiDung::class, 
            'theo_doi', 
            'ma_nguoi_theo_doi',      // Mình là người đi follow
            'ma_nguoi_duoc_theo_doi'  // Người mình follow
        )->wherePivot('trang_thai', 1); 
    }


=======
>>>>>>> 2a0fd928dbc5662ec43f263e0739c16ae8294922
}