<?php

// Dữ liệu tạo đầu tiên cho các bảng chính trong hệ thống
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;


class MasterDataSeeder extends Seeder
{
    public function run()
    {
        
        DB::table('danh_muc')->insert([
            ['ten_danh_muc' => 'Món Canh', 'mo_ta' => 'Các món canh ngon'],
            ['ten_danh_muc' => 'Món Kho', 'mo_ta' => 'Đậm đà hương vị Việt'],
            ['ten_danh_muc' => 'Ăn vặt', 'mo_ta' => 'Món ăn nhẹ'],
        ]);

        
        DB::table('vung_mien')->insert([
            ['ten_vung_mien' => 'Miền Bắc', 'mo_ta' => 'Tinh tế, nhẹ nhàng'],
            ['ten_vung_mien' => 'Miền Trung', 'mo_ta' => 'Cay nồng, đậm đà'],
            ['ten_vung_mien' => 'Miền Nam', 'mo_ta' => 'Ngọt ngào, phong phú'],
        ]);

      
        DB::table('the')->insert([
            ['ten_the' => '#GiamCan'],
            ['ten_the' => '#NhanhGon'],
            ['ten_the' => '#MuaHe'],
        ]);

        
        DB::table('nguyen_lieu')->insert([
            ['ten_nguyen_lieu' => 'Thịt bò', 'loai_nguyen_lieu' => 'Thịt', 'hinh_anh' => 'beef.jpg'],
            ['ten_nguyen_lieu' => 'Muối', 'loai_nguyen_lieu' => 'Gia vị', 'hinh_anh' => 'salt.jpg'],
            ['ten_nguyen_lieu' => 'Rau muống', 'loai_nguyen_lieu' => 'Rau', 'hinh_anh' => 'vegetable.jpg'],
        ]);

       
        // vai_tro phải là 'Admin', 'DauBep' hoặc 'User'
        DB::table('nguoi_dung')->insert([
            [
                'ten_dang_nhap' => 'admin_01',
                'mat_khau' => Hash::make('123456'),
                'email' => 'admin@foodblog.com',
                'ho_ten' => 'Quản Trị Viên',
                'ngay_sinh' => '1990-01-01',
                'gioi_tinh' => 'Nam',
                'vai_tro' => 'Admin'
            ],
            [
                'ten_dang_nhap' => 'chef_huong',
                'mat_khau' => Hash::make('123456'),
                'email' => 'huong@foodblog.com',
                'ho_ten' => 'Đầu Bếp Hương',
                'ngay_sinh' => '1995-05-15',
                'gioi_tinh' => 'Nữ',
                'vai_tro' => 'DauBep'
            ]
        ]);
    }
}