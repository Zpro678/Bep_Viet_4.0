<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use App\Models\The;
use App\Exceptions\ForbiddenException;

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
        'trang_thai',
        'thoi_gian_nau',
        'khau_phan',
        'do_kho',
        'ngay_tao'
    ];
    public function luotThich()
    {
        return $this->morphMany(LuotThich::class, 'thich');
    }

    public function scopeDaDuyet($query)
    {
        return $query->where('trang_thai', 'cong_khai');
    }

    // Dùng để lấy bài chờ duyệt: CongThuc::choDuyet()->get();
    public function scopeChoDuyet($query)
    {
        return $query->where('trang_thai', 'cho_duyet');
    }

    public function cacBuoc()
    {
        return $this->hasMany(
            BuocThucHien::class,
            'ma_cong_thuc',   // FK ở bảng buoc_thuc_hien
            'ma_cong_thuc'    // PK ở bảng cong_thuc
        )->orderBy('so_thu_tu');
    }
    // BelongsTo: Thuộc về 1 Người dùng 
    public function nguoiTao()
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


    // Many-to-Many: Nguyên liệu (qua bảng trung gian CongThuc_NguyenLieu) 
    public function nguyenLieu()
    {
        return $this->belongsToMany(NguyenLieu::class, 'cong_thuc_nguyen_lieu', 'ma_cong_thuc', 'ma_nguyen_lieu')
                    ->withPivot('dinh_luong', 'don_vi_tinh'); 

    }

    // Many-to-Many: Thẻ/Tags (qua bảng trung gian CongThuc_The) [cite: 314]

    public function the()
    {
        return $this->belongsToMany(The::class, 'cong_thuc_the', 'ma_cong_thuc', 'ma_the');
    }


    // HasMany: Hình ảnh 

    public function hinhAnh()
    {
        return $this->hasMany(HinhAnhCongThuc::class, 'ma_cong_thuc', 'ma_cong_thuc');
    }
    public function video()
    {
        return $this->hasMany(VideoHuongDan::class, 'ma_cong_thuc', 'ma_cong_thuc');
    }

    // hasMany: đánh giá
    public function danhGia()
    {
        return $this->hasMany(DanhGia::class, 'ma_cong_thuc', 'ma_cong_thuc');
    }

    // hasMany: bình luận
    public function binhLuan()
    {
        return $this->hasMany(BinhLuan::class, 'ma_cong_thuc', 'ma_cong_thuc')
            ->whereNull('ma_binh_luan_cha');
    }

    // hasMany: bộ sưu tập
    public function trongBoSuuTap()
    {
        return $this->hasMany(ChiTietBoSuuTap::class, 'ma_cong_thuc', 'ma_cong_thuc');
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

    //    15. CHI TIẾT CƠ BẢN
    public static function getDetailBasic(int $id): self
    {
        return self::with([
            'nguoiTao:ma_nguoi_dung,ho_ten',
            'danhMuc:ma_danh_muc,ten_danh_muc',
            'vungMien:ma_vung_mien,ten_vung_mien'
        ])->findOrFail($id);
    }

    //    16. CHI TIẾT ĐẦY ĐỦ
    public static function getDetailFull(int $id): self
    {
        return self::with([
            'nguoiTao',
            'danhMuc',
            'vungMien',
            'nguyenLieu',
            'buocThucHien.hinhAnh',
            'hinhAnh',
            'video',
            'the',
            'binhLuan.cacTraLoi'
        ])->findOrFail($id);
    }

    //    19. CÔNG THỨC PHỔ BIẾN
    public static function getPopular(int $limit = 10)
    {
        return self::withCount('danhGia')
            ->withAvg('danhGia', 'so_sao')
            ->orderByDesc('danh_gia_count')
            ->orderByDesc('danh_gia_avg_so_sao')
            ->limit($limit)
            ->get();
    }

    //    20. SEARCH NÂNG CAO
    public static function searchAdvanced(array $filters)
    {
        return self::query()
            ->when($filters['keyword'] ?? null, function (Builder $q, $v) {
                $q->where('ten_mon', 'like', "%$v%");
            })
            ->when(
                $filters['ma_danh_muc'] ?? null,
                fn($q, $v) =>
                $q->where('ma_danh_muc', $v)
            )
            ->when(
                $filters['ma_vung_mien'] ?? null,
                fn($q, $v) =>
                $q->where('ma_vung_mien', $v)
            )
            ->when(
                $filters['do_kho'] ?? null,
                fn($q, $v) =>
                $q->where('do_kho', $v)
            )
            ->with([
                'nguoiTao:ma_nguoi_dung,ho_ten',
                'danhMuc:ma_danh_muc,ten_danh_muc',
                'vungMien:ma_vung_mien,ten_vung_mien'
            ])
            ->orderByDesc('ngay_tao')
            ->paginate(10);
    }

    // 17. Cập nhật công thức
    public static function capNhatCongThuc(int $id, int $userId, array $data): self
    {
        $congThuc = self::findOrFail($id);

        if ($congThuc->ma_nguoi_dung !== $userId) {
            throw new ForbiddenException();
        }

        $congThuc->update($data);

        return $congThuc;
    }

    // 18. Xóa công thức
    public static function xoaCongThuc(int $id, int $userId): void
    {
        $congThuc = self::findOrFail($id);

        if ($congThuc->ma_nguoi_dung !== $userId) {
            throw new ForbiddenException();
        }

        $congThuc->delete();
    }


    // 21. Thêm/Sửa nguyên liệu cho công thức
    public static function dongBoNguyenLieu(int $id, int $userId, array $ingredients): self
    {
        $congThuc = self::findOrFail($id);

        if ($congThuc->ma_nguoi_dung !== $userId) {
            throw new ForbiddenException();
        }

        $congThuc->nguyenLieu()->sync($ingredients);

        return $congThuc->load('nguyenLieu');
    }

    // 22. Gán danh mục cho công thức
    public static function capNhatDanhMuc( int $id, int $userId, int $maDanhMuc): self {
        $congThuc = self::findOrFail($id);

        if ($congThuc->ma_nguoi_dung !== $userId) {
            throw new ForbiddenException();
        }

        $congThuc->ma_danh_muc = $maDanhMuc;
        $congThuc->save();

        return $congThuc->load('danhMuc');
    }
}
