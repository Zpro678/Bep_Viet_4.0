<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class VideoHuongDan extends Model {
    protected $table = 'VideoHuongDan';
    protected $primaryKey = 'ma_video';
    public $timestamps = false;
    protected $fillable = [
        'ma_cong_thuc', 'tieu_de_video', 'duong_dan_video', 
        'nen_tang', 'thoi_luong', 'la_video_chinh'
    ];
}