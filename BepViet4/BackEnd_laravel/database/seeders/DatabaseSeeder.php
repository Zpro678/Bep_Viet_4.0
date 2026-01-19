<?php

namespace Database\Seeders;

use App\Models\NguoiDung;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        NguoiDung::create([
            'ten_dang_nhap' => 'admin_test',
            'mat_khau'      => Hash::make('123456'), // Mã hóa mật khẩu
            'email'         => 'test@example.com',
            'ho_ten'        => 'Người Dùng Thử Nghiệm',
            'ngay_sinh'     => '1995-01-01',
            'gioi_tinh'     => 'Nam',
            'vai_tro'       => 'admin',
        ]);
    }
}
