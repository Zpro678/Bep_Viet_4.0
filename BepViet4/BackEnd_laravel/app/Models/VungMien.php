<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VungMien extends Model
{
    protected $table = 'vung_mien';
    protected $primaryKey = 'ma_vung_mien';
    public $timestamps = false;
    protected $fillable = ['ten_vung_mien', 'mo_ta'];

    // hasMany: 1 vùng miền có nhiều công thức
    public function congThuc()
    {
        return $this->hasMany(CongThuc::class, 'ma_vung_mien', 'ma_vung_mien');
    }
}
