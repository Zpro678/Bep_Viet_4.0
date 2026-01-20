<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DanhMuc extends Model
{
    protected $table = 'danh_muc';
    protected $primaryKey = 'ma_danh_muc';
    public $timestamps = false;
    protected $fillable = ['ten_danh_muc', 'mo_ta'];

    // hasMany: 1 danh mục có nhiều công thức
    public function congThuc()
    {
        return $this->hasMany(CongThuc::class, 'ma_danh_muc', 'ma_danh_muc');
    }
}
