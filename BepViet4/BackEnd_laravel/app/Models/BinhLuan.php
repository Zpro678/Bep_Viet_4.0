<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BinhLuan extends Model
{
    use HasFactory;
    protected $table = 'binh_luan';
    protected $primaryKey = 'ma_binh_luan';
    protected $fillable = [
        'ma_nguoi_dung',
        'ma_cong_thuc',
        'ma_binh_luan_cha', 
        'noi_dung',
        'ngay_gui',
    ];
    protected $casts = [
        'ngay_gui' => 'datetime',
    ];
    public function nguoiDung()
    {
        return $this->belongsTo(NguoiDung::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }
    public function congThuc()
    {
        return $this->belongsTo(CongThuc::class, 'ma_cong_thuc', 'ma_cong_thuc');
    }
    public function binhLuanCha()
    {
        return $this->belongsTo(BinhLuan::class, 'ma_binh_luan_cha', 'ma_binh_luan');
    }
    public function cacTraLoi()
    {
        return $this->hasMany(BinhLuan::class, 'ma_binh_luan_cha', 'ma_binh_luan');
    }
}