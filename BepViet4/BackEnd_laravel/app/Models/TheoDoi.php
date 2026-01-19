<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TheoDoi extends Model
{
    protected $table = 'theo_doi';

    public $incrementing = false; // Tắt tính năng ID tự tăng
    protected $primaryKey = ['ma_nguoi_theo_doi', 'ma_nguoi_duoc_theo_doi']; // Khai báo khóa chính (chỉ mang tính tham khảo cho code, Laravel Eloquent chuẩn không dùng mảng ở đây để query find())
    
    public $timestamps = false;

    protected $fillable = [
        'ma_nguoi_theo_doi',
        'ma_nguoi_duoc_theo_doi',
        'ngay_theo_doi',
        'trang_thai' // 0: Đang theo dõi, 1: Chặn (tùy nghiệp vụ)
    ];

    
    public function nguoiTheoDoi()
    {
        return $this->belongsTo(NguoiDung::class, 'ma_nguoi_theo_doi', 'ma_nguoi_dung');
    }

    public function nguoiDuocTheoDoi()
    {
        return $this->belongsTo(NguoiDung::class, 'ma_nguoi_duoc_theo_doi', 'ma_nguoi_dung');
    }

    //
     public static function theoDoi($from, $to)
    {
        return self::firstOrCreate([
            'ma_nguoi_theo_doi' => $from,
            'ma_nguoi_duoc_theo_doi' => $to
        ], [
            'ngay_theo_doi' => now(),
            'trang_thai' => 0
        ]);
    }

    public static function huyTheoDoi($from, $to)
    {
        return self::where([
            'ma_nguoi_theo_doi' => $from,
            'ma_nguoi_duoc_theo_doi' => $to
        ])->delete();
    }
}