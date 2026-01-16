<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChiTietBoSuuTap extends Model
{
    protected $table = 'chi_tiet_bo_suu_tap';

    public $incrementing = false;

    protected $primaryKey = null;

    protected $fillable = [
        'ma_bo_suu_tap',
        'ma_cong_thuc',
        'ngay_them',
        'ghi_chu'
    ];

    // Quan hệ
    public function boSuuTap()
    {
        return $this->belongsTo(BoSuuTap::class, 'ma_bo_suu_tap');
    }

    public function congThuc()
    {
        return $this->belongsTo(CongThuc::class, 'ma_cong_thuc');
    }
}
