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
    public function congThuc()
    {
        return $this->hasMany(CongThuc::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }

    public function baiViet()
    {
        return $this->hasMany(BaiViet::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }

    public function boSuuTap()
    {
        return $this->hasMany(BoSuuTap::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }
}