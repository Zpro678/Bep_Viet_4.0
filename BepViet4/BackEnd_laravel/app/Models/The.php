<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class The extends Model
{
    use HasFactory;

    protected $table = 'the';
    protected $primaryKey = 'ma_the';
    public $timestamps = false;

    protected $fillable = [
        'ten_the'
    ];

    // many to many: thông qua bảng trung gian CongThucThe
    public function congThuc()
    {
        return $this->belongsToMany(
            CongThuc::class,
            'cong_thuc_the',
            'ma_the',
            'ma_cong_thuc'
        );
    }

}
