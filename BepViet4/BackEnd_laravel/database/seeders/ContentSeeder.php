<?php
// Dữ liệu chính
namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
class ContentSeeder extends Seeder
{
    public function run()
    {
 
        $userId = DB::table('nguoi_dung')->first()->ma_nguoi_dung;
        $danhMucId = DB::table('danh_muc')->first()->ma_danh_muc;
        $vungMienId = DB::table('vung_mien')->first()->ma_vung_mien;

        $congThucId = DB::table('cong_thuc')->insertGetId([
            'ma_nguoi_dung' => $userId,
            'ma_danh_muc' => $danhMucId,
            'ma_vung_mien' => $vungMienId,
            'ten_mon' => 'Canh Chua Cá Lóc',
            'mo_ta' => 'Món canh chua giải nhiệt mùa hè',
            'trang_thai'=> 'cong_khai',
            'thoi_gian_nau' => 30,
            'khau_phan' => 4,
            'do_kho' => 2, // 1-5
            'ngay_tao' => Carbon::now(),
        ]);

   
        $baiVietId = DB::table('bai_viet')->insertGetId([
            'ma_nguoi_dung' => $userId,
            'tieu_de' => 'Top 10 món ăn giải nhiệt',
            'noi_dung' => 'Nội dung bài viết về các món ăn...',
            'ngay_dang' => Carbon::now(),
            'luot_yeu_thich' => 0,
            'luot_chia_se' => 0
        ]);

      
        DB::table('bo_suu_tap')->insert([
            'ma_nguoi_dung' => $userId,
            'ten_bo_suu_tap' => 'Món ngon cuối tuần'
        ]);
    }
}