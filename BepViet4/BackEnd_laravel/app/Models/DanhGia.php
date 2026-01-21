<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DanhGia extends Model
{
    use HasFactory;
    protected $table = 'danh_gia';
    protected $primaryKey = 'ma_danh_gia';
    protected $fillable = [
        'ma_nguoi_dung',
        'ma_cong_thuc',
        'so_sao',
        'trang_thai',
    ];
    public $timestamps = true;
    public function nguoiDung()
    {
        return $this->belongsTo(NguoiDung::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }
    public function congThuc()
    {
        return $this->belongsTo(CongThuc::class, 'ma_cong_thuc', 'ma_cong_thuc');
    }
}