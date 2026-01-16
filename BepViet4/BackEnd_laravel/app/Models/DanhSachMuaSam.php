<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DanhSachMuaSam extends Model
{
    protected $table = 'danh_sach_mua_sam';

    protected $primaryKey = 'ma_mua_sam';

    protected $fillable = [
        'ma_nguoi_dung',
        'ma_nguyen_lieu',
        'so_luong_can',
        'don_vi',
        'trang_thai'
    ];

    // Quan hệ
    public function nguoiDung()
    {
        return $this->belongsTo(NguoiDung::class, 'ma_nguoi_dung');
    }

    public function nguyenLieu()
    {
        return $this->belongsTo(NguyenLieu::class, 'ma_nguyen_lieu');
    }
}
