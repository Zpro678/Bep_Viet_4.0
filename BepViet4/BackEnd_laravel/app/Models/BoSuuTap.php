<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\QueryException;
use App\Exceptions\BusinessException;

class BoSuuTap extends Model
{
    use HasFactory;
    protected $table = 'bo_suu_tap';
    protected $primaryKey = 'ma_bo_suu_tap';
    protected $fillable = [
        'ma_nguoi_dung',
        'ten_bo_suu_tap',
    ];

    public $timestamps = true;

    public function nguoiDung()
    {
        return $this->belongsTo(NguoiDung::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }
    public function congThucs()
    {
        return $this->belongsToMany(
            CongThuc::class, 
            'chi_tiet_bo_suu_tap', 
            'ma_bo_suu_tap',       
            'ma_cong_thuc'         
        )->withPivot('ngay_them', 'ghi_chu'); 
    }

    // hasMany: chi tiết bộ sưu tập
    public function chiTiet()
    {
        return $this->hasMany(ChiTietBoSuuTap::class, 'ma_bo_suu_tap', 'ma_bo_suu_tap');
    }

    // 28. Danh sách bộ sưu tập của user
    public static function danhSachCuaUser(int $userId): Collection
    {
        return self::where('ma_nguoi_dung', $userId)
            ->withCount('chiTiet') // số công thức trong bộ sưu tập
            ->orderByDesc('created_at')
            ->get();
    }

    // 29. Tạo bộ sưu tập mới
    public static function taoBoSuuTap(int $userId, array $data): self
    {
        // không trùng tên bst trong cùng user
        $exists = self::where('ma_nguoi_dung', $userId)
            ->where('ten_bo_suu_tap', $data['ten_bo_suu_tap'])
            ->exists();

        if ($exists) {
            throw new BusinessException('Bộ sưu tập đã tồn tại', 409);
        }

        try {
            return self::create([
                'ma_nguoi_dung'  => $userId,
                'ten_bo_suu_tap' => $data['ten_bo_suu_tap'],
            ]);
        } catch (QueryException $e) {
            throw new BusinessException('Không thể tạo bộ sưu tập', 500);
        }
    }
}
