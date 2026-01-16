<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class DanhMuc extends Model {
    protected $table = 'DanhMuc';
    protected $primaryKey = 'ma_danh_muc';
    public $timestamps = false;
    protected $fillable = ['ten_danh_muc', 'mo_ta'];
}