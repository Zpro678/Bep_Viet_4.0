<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HinhAnhBuoc extends Model {
    protected $table = 'hinh_anh_buoc';
    protected $primaryKey = 'ma_hinh_anh';
    public $timestamps = false;
    protected $fillable = ['ma_buoc', 'duong_dan', 'mo_ta'];

    public function buocThucHien()
    {
        return $this->belongsTo(
            BuocThucHien::class,
            'ma_buoc',
            'ma_buoc'
        );
    }
}
