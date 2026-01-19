<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    // protected $fillable = [
    //     'name',
    //     'email',
    //     'password',
    // ];

    // /**
    //  * The attributes that should be hidden for serialization.
    //  *
    //  * @var list<string>
    //  */
    // protected $hidden = [
    //     'password',
    //     'remember_token',
    // ];

    // /**
    //  * Get the attributes that should be cast.
    //  *
    //  * @return array<string, string>
    //  */
    // protected function casts(): array
    // {
    //     return [
    //         'email_verified_at' => 'datetime',
    //         'password' => 'hashed',
    //     ];
    // }


    // tên bảng thực tế
    protected $table = 'nguoi_dung';

    // khóa chính 
    protected $primaryKey = 'ma_nguoi_dung';

    protected $fillable = [
        'ten_dang_nhap',
        'mat_khau',
        'email',
        'ho_ten',
        'ngay_sinh',
        'gioi_tinh',
        'vai_tro',
    ];

    // Laravel mặc định tìm cột 'password', tbáo dùng 'mat_khau'
    public function getAuthPassword()
    {
        return $this->mat_khau;
    }
}
