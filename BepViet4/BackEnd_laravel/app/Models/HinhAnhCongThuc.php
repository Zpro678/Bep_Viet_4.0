<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HinhAnhCongThuc extends Model {
    protected $table = 'hinh_anh_cong_thuc';

    protected $primaryKey = 'ma_hinh_anh';

    protected $fillable = [
        'ma_cong_thuc',
        'duong_dan',
        'mo_ta'
    ];

    // Quan hệ
    public function congThuc()
    {
        return $this->belongsTo(CongThuc::class, 'ma_cong_thuc');
    }
}