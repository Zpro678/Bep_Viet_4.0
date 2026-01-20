<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\CongThuc;
use App\Models\BaiViet;
use App\Models\BoSuuTap;
class LuotThich extends Model
{
    use HasFactory;

   
    protected $table = 'luot_thich';
    protected $fillable = [
        'ma_nguoi_dung',
        'thich_id',
        'thich_type'
    ];

    public function thich()
    {
        return $this->morphTo();
    }

   
    public function nguoiDung()
    {
 
        return $this->belongsTo(NguoiDung::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }
}
