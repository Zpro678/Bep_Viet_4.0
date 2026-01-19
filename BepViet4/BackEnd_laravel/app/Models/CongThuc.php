<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\The;

class CongThuc extends Model
{
    protected $table = 'cong_thuc';
    protected $primaryKey = 'ma_cong_thuc';
    public $timestamps = false; // Xử lý thủ công cột 'ngay_tao'

    protected $fillable = [
        'ma_nguoi_dung',
        'ma_danh_muc',
        'ma_vung_mien',
        'ten_mon',
        'mo_ta',
        'thoi_gian_nau',
        'khau_phan',
        'do_kho',
        'ngay_tao'
    ];

    // BelongsTo: Thuộc về 1 Người dùng 
    public function tacGia()
    {
        return $this->belongsTo(NguoiDung::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }

    // BelongsTo: Thuộc về 1 Danh mục [cite: 318, 361]
    public function danhMuc()
    {
        return $this->belongsTo(DanhMuc::class, 'ma_danh_muc', 'ma_danh_muc');
    }

    // BelongsTo: Thuộc về 1 Vùng miền [cite: 320, 361]
    public function vungMien()
    {
        return $this->belongsTo(VungMien::class, 'ma_vung_mien', 'ma_vung_mien');
    }

    // HasMany: Có nhiều Bước thực hiện [cite: 307]
    public function buocThucHien()
    {
        return $this->hasMany(BuocThucHien::class, 'ma_cong_thuc', 'ma_cong_thuc')->orderBy('so_thu_tu');
    }

    // Many-to-Many: Nguyên liệu (qua bảng trung gian CongThuc_NguyenLieu) [cite: 310, 312]
    public function nguyenLieu()
    {
        return $this->belongsToMany(NguyenLieu::class, 'cong_thuc_nguyen_lieu', 'ma_cong_thuc', 'ma_nguyen_lieu')
            ->withPivot('dinh_luong', 'don_vi_tinh'); // [cite: 313]
    }

    // Many-to-Many: Thẻ/Tags (qua bảng trung gian CongThuc_The) [cite: 314]
    public function the()
    {
        return $this->belongsToMany(The::class, 'cong_thuc_the', 'ma_cong_thuc', 'ma_the');
    }

    // HasMany: Hình ảnh [cite: 388]
    public function hinhAnh()
    {
        return $this->hasMany(HinhAnhCongThuc::class, 'ma_cong_thuc', 'ma_cong_thuc');
    }

    // HasMany: Video [cite: 392]
    public function video()
    {
        return $this->hasMany(VideoHuongDan::class, 'ma_cong_thuc', 'ma_cong_thuc');
    }

    // Tạo công thức
    public static function taoCongThuc($userId, $data)
    {
        $data['ma_nguoi_dung'] = $userId;
        $data['ngay_tao'] = now();

        return self::create($data);
    }

    // Danh sách + lọc
    public static function danhSach($filter)
    {
        return self::when(
            $filter['ten'] ?? null,
            fn($q, $v) =>
            $q->where('ten_mon', 'like', "%$v%")
        )
            ->when(
                $filter['do_kho'] ?? null,
                fn($q, $v) =>
                $q->where('do_kho', $v)
            )
            ->orderByDesc('ngay_tao')
            ->paginate(10);
    }
}
