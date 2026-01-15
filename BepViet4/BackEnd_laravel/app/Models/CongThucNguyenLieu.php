<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CongThucNguyenLieu extends Model
{
    protected $table = 'cong_thuc_nguyen_lieu';

    public $incrementing = false;
    public $timestamps = false;

    protected $primaryKey = null;

    protected $fillable = [
        'ma_cong_thuc',
        'ma_nguyen_lieu',
        'dinh_luong',
        'don_vi_tinh'
    ];
}
