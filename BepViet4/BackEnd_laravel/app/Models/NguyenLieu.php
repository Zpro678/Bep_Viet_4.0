<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NguyenLieu extends Model
{
    use HasFactory;

    protected $table = 'nguyen_lieu';
    protected $primaryKey = 'ma_nguyen_lieu';

    public $timestamps = false;

    protected $fillable = [
        'ten_nguyen_lieu',
        'loai_nguyen_lieu',
        'hinh_anh'
    ];

    // many to many: thông qua bảng trung gian CongThucNguyenLieu
    public function congThuc()
    {
        return $this->belongsToMany(
            CongThuc::class,
            'cong_thuc_nguyen_lieu',
            'ma_nguyen_lieu',
            'ma_cong_thuc'
        )->withPivot('dinh_luong', 'don_vi_tinh');
    }

    // 
    public function trongDanhSachMuaSam()
    {
        return $this->hasMany(DanhSachMuaSam::class, 'ma_nguyen_lieu', 'ma_nguyen_lieu');
    }
}
