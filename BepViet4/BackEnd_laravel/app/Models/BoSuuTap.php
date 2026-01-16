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


}