<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HinhAnhBaiViet extends Model {
    protected $table = 'hinh_anh_bai_viet';
    protected $primaryKey = 'ma_hinh_anh';
    public $timestamps = false;
    protected $fillable = ['ma_bai_viet', 'duong_dan', 'mo_ta'];
}
