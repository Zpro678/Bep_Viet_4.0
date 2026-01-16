<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuocThucHien extends Model
{
    use HasFactory;

    protected $table = 'buoc_thuc_hien';
    protected $primaryKey = 'ma_buoc';

    public $timestamps = false;

    protected $fillable = [
        'ma_cong_thuc',
        'so_thu_tu',
        'noi_dung',
        'thoi_gian'
    ];

    // QH: Bước thực hiện thuộc về 1 công thức
    public function congThuc()
    {
        return $this->belongsTo(CongThuc::class, 'ma_cong_thuc', 'ma_cong_thuc');
    }
}
