<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class BaiViet extends Model {
    protected $table = 'BaiViet';
    protected $primaryKey = 'ma_bai_viet';
    public $timestamps = false;
    protected $fillable = [
        'ma_nguoi_dung', 'tieu_de', 'noi_dung', 'hinh_anh_dai_dien', 
        'ngay_dang', 'ngay_chinh', 'luot_yeu_thich', 'luot_chia_se'
    ];

    public function nguoiDung() { return $this->belongsTo(NguoiDung::class, 'ma_nguoi_dung'); }
    public function binhLuan() { return $this->hasMany(BinhLuanBaiViet::class, 'ma_bai_viet'); }
    public function hinhAnh() { return $this->hasMany(HinhAnhBaiViet::class, 'ma_bai_viet'); }
}