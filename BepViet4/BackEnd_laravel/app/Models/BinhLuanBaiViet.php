<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BinhLuanBaiViet extends Model {
    protected $table = 'binh_luan_bai_viet';
    protected $primaryKey = 'ma_binh_luan';
    public $timestamps = false;
    protected $fillable = ['ma_nguoi_dung', 'ma_bai_viet', 'ma_binh_luan_cha', 'noi_dung', 'ngay_gui'];
    
    public function nguoiDung() { return $this->belongsTo(NguoiDung::class, 'ma_nguoi_dung'); }
}