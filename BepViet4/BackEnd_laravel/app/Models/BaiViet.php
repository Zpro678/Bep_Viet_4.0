<?php

namespace App\Models;

use App\Models\NguoiDung;
use App\Models\BinhLuanBaiViet;
use App\Models\HinhAnhBaiViet;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use App\Exceptions\ForbiddenException;

class BaiViet extends Model
{
    protected $table = 'bai_viet';
    protected $primaryKey = 'ma_bai_viet';
    public $timestamps = false;
    protected $fillable = [
        'ma_nguoi_dung',
        'tieu_de',
        'noi_dung',
        'hinh_anh_dai_dien',
        'ngay_dang',
        'ngay_chinh',
        'luot_yeu_thich',
        'luot_chia_se'
    ];

    public function nguoiDung()
    {
        return $this->belongsTo(NguoiDung::class, 'ma_nguoi_dung');
    }
    public function binhLuan()
    {
        return $this->hasMany(BinhLuanBaiViet::class, 'ma_bai_viet');
    }
    public function hinhAnh()
    {
        return $this->hasMany(HinhAnhBaiViet::class, 'ma_bai_viet');
    }

    // 23. LỌC DANH SÁCH BÀI VIẾT
    public static function danhSach(array $filters)
    {
        return self::query()
            ->when(
                $filters['keyword'] ?? null,
                function (Builder $q, $v) {
                    $q->where('tieu_de', 'like', "%$v%")
                      ->orWhere('noi_dung', 'like', "%$v%");
                }
            )
            ->with([
                'nguoiDung:ma_nguoi_dung,ho_ten'
            ])
            ->orderByDesc('ngay_dang')
            ->paginate(10);
    }

    // 25. CHI TIẾT BÀI VIẾT
    public static function chiTiet(int $id): self
    {
        return self::with([
            'nguoiDung:ma_nguoi_dung,ho_ten',
            'binhLuan',
            'hinhAnh'
        ])->findOrFail($id);
    }

    // KIỂM TRA: tài khoản vai trò BLOGGER
     private static function checkBlogger(NguoiDung $user): void
    {
        if ($user->vai_tro !== 'blogger') {
            throw new ForbiddenException('Chỉ blogger mới được thực hiện thao tác này');
        }
    }

    // 24. TẠO BÀI VIẾT
    public static function taoBaiViet(NguoiDung $user, array $data): self
    {
        self::checkBlogger($user);

        $data['ma_nguoi_dung'] = $user->ma_nguoi_dung;
        $data['ngay_dang'] = now();

        return self::create($data);
    }

    // 26. CẬP NHẬT BÀI VIẾT
    public static function capNhatBaiViet(int $id, NguoiDung $user, array $data): self
    {
       self::checkBlogger($user);

        $baiViet = self::findOrFail($id);

        if ($baiViet->ma_nguoi_dung !== $user->ma_nguoi_dung) {
            throw new ForbiddenException('Bạn không có quyền chỉnh sửa bài viết này');
        }

        $data['ngay_chinh'] = now();

        $baiViet->update($data);

        return $baiViet;
    }

    // ===== 27. XÓA BÀI VIẾT =====
    public static function xoaBaiViet(int $id, NguoiDung $user): void
    {
        self::checkBlogger($user);

        $baiViet = self::findOrFail($id);

        if ($baiViet->ma_nguoi_dung !== $user->ma_nguoi_dung) {
            throw new ForbiddenException('Bạn không có quyền xóa bài viết này');
        }

        // // Xóa ảnh liên quan (nếu DB chưa cascade)
        // HinhAnhBaiViet::where('ma_bai_viet', $id)->delete();

        // // Xóa bình luận
        // BinhLuanBaiViet::where('ma_bai_viet', $id)->delete();

        $baiViet->delete();
    }
}
