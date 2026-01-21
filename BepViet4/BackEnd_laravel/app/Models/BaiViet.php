<?php

namespace App\Models;

use App\Models\NguoiDung;
use App\Models\BinhLuanBaiViet;
use App\Models\HinhAnhBaiViet;
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
        // Quan hệ 1-N với bảng bình luận
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
            ->when($filters['keyword'] ?? null, function ($q, $v) {
                $q->where('tieu_de', 'like', "%$v%")
                  ->orWhere('noi_dung', 'like', "%$v%");
            })
            ->with([
                'nguoiDung:ma_nguoi_dung,ho_ten,anh_dai_dien', 
                'hinhAnh' 
            ])
            ->withCount('binhLuan') 
            ->orderByDesc('ngay_dang')
            ->paginate(10);
    }

    // [ĐÃ SỬA 100%]: Chỉ lấy bình luận GỐC (không lấy câu trả lời) khi xem chi tiết
    public static function chiTiet(int $id): self
    {
        return self::with([
            'nguoiDung:ma_nguoi_dung,ho_ten,anh_dai_dien',
            'hinhAnh',
            // Load bình luận: Chỉ lấy comment cha (ma_binh_luan_cha = null)
            'binhLuan' => function($query) {
                $query->whereNull('ma_binh_luan_cha') // <--- QUAN TRỌNG: Lọc bỏ các câu reply
                      ->orderByDesc('ngay_gui') 
                      ->with('nguoiDung:ma_nguoi_dung,ho_ten,anh_dai_dien')
                      ->withCount('traLoi'); // Đếm số câu trả lời để hiển thị "Xem x câu trả lời"
            }
        ])
        ->withCount('binhLuan') 
        ->findOrFail($id);
    }

    // Kiểm tra quyền
    private static function checkQuyenDangBai(NguoiDung $user): void
    {
        $cacVaiTroDuocPhep = ['blogger', 'admin'];
        if (!in_array($user->vai_tro, $cacVaiTroDuocPhep)) {
            throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này');
        }
    }

    // 24. TẠO BÀI VIẾT
    public static function taoBaiViet(NguoiDung $user, array $data): self
    {
        self::checkQuyenDangBai($user);
        $data['ma_nguoi_dung'] = $user->ma_nguoi_dung;
        $data['ngay_dang'] = now();
        return self::create($data);
    }

    // 26. CẬP NHẬT BÀI VIẾT
    public static function capNhatBaiViet(int $id, NguoiDung $user, array $data): self
    {
        self::checkQuyenDangBai($user);
        $baiViet = self::findOrFail($id);
        if ($baiViet->ma_nguoi_dung !== $user->ma_nguoi_dung) {
            throw new ForbiddenException('Bạn không có quyền chỉnh sửa bài viết này');
        }
        $data['ngay_chinh'] = now();
        $baiViet->update($data);
        return $baiViet;
    }

    // 27. XÓA BÀI VIẾT
    public static function xoaBaiViet(int $id, NguoiDung $user): void
    {
        self::checkQuyenDangBai($user);
        $baiViet = self::findOrFail($id);
        if ($baiViet->ma_nguoi_dung !== $user->ma_nguoi_dung) {
            throw new ForbiddenException('Bạn không có quyền xóa bài viết này');
        }
        $baiViet->delete();
    }
}