<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThucDon extends Model
{
    protected $table = 'thuc_don';

    protected $primaryKey = 'ma_thuc_don';

    protected $fillable = [
        'ma_nguoi_dung',
        'ma_cong_thuc',
        'ngay_an',
        'buoi'
    ];

    // Quan hệ
    public function nguoiDung()
    {
        return $this->belongsTo(NguoiDung::class, 'ma_nguoi_dung');
    }

    public function congThuc()
    {
        return $this->belongsTo(CongThuc::class, 'ma_cong_thuc');
    }
}
