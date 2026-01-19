<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BoSuuTap extends Model
{
    use HasFactory;
    protected $table = 'bo_suu_tap';
    protected $primaryKey = 'ma_bo_suu_tap';
    protected $fillable = [
        'ma_nguoi_dung',
        'ten_bo_suu_tap',
    ];


    public $timestamps = true;

    public function nguoiDung()
    {
        return $this->belongsTo(NguoiDung::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }

<<<<<<< HEAD
    public function congThucs()
    {
        return $this->belongsToMany(
            CongThuc::class, 
            'chi_tiet_bo_suu_tap', 
            'ma_bo_suu_tap',       
            'ma_cong_thuc'         
        )->withPivot('ngay_them', 'ghi_chu'); 
    }
=======
>>>>>>> 2a0fd928dbc5662ec43f263e0739c16ae8294922

}