<?php

namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\CongThuc;
use App\Models\BaiViet;
use App\Models\BoSuuTap;
use App\Models\The;
class NguoiDung extends Authenticatable
{
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
    // public function followers()
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

}