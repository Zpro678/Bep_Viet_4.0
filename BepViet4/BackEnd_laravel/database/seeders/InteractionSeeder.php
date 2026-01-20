<?php
//Dữ liệu tương tác
namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
class InteractionSeeder extends Seeder
{
    public function run()
    {
        $user = DB::table('nguoi_dung')->first();
        $ctId = DB::table('cong_thuc')->first()->ma_cong_thuc;
        $bvId = DB::table('bai_viet')->first()->ma_bai_viet;
        $bstId = DB::table('bo_suu_tap')->first()->ma_bo_suu_tap;
        $nlId = DB::table('nguyen_lieu')->first()->ma_nguyen_lieu;

   
        DB::table('binh_luan')->insert([
            'ma_nguoi_dung' => $user->ma_nguoi_dung,
            'ma_cong_thuc' => $ctId,
            'noi_dung' => 'Món này rất ngon!',
            'ngay_gui' => Carbon::now()
        ]);

        DB::table('danh_gia')->insert([
            'ma_nguoi_dung' => $user->ma_nguoi_dung,
            'ma_cong_thuc' => $ctId,
            'so_sao' => 5
        ]);

       
        DB::table('binh_luan_bai_viet')->insert([
            'ma_nguoi_dung' => $user->ma_nguoi_dung,
            'ma_bai_viet' => $bvId,
            'noi_dung' => 'Bài viết rất hữu ích',
            'ngay_gui' => Carbon::now()
        ]);

        DB::table('chi_tiet_bo_suu_tap')->insert([
            'ma_bo_suu_tap' => $bstId,
            'ma_cong_thuc' => $ctId,
            'ngay_them' => Carbon::now(),
            'ghi_chu' => 'Phải nấu món này'
        ]);

        DB::table('thuc_don')->insert([
            'ma_nguoi_dung' => $user->ma_nguoi_dung,
            'ma_cong_thuc' => $ctId,
            'ngay_an' => Carbon::today(),
            'buoi' => 'Trưa' // Sáng, Trưa, Tối, Phụ
        ]);

        DB::table('danh_sach_mua_sam')->insert([
            'ma_nguoi_dung' => $user->ma_nguoi_dung,
            'ma_nguyen_lieu' => $nlId,
            'so_luong_can' => 1,
            'don_vi' => 'kg',
            'trang_thai' => 0 // 0: chưa mua
        ]);

       
        // Cần user thứ 2 để follow user 1
        $user2 = DB::table('nguoi_dung')->where('ma_nguoi_dung', '!=', $user->ma_nguoi_dung)->first();
        if ($user2) {
            DB::table('theo_doi')->insert([
                'ma_nguoi_theo_doi' => $user2->ma_nguoi_dung,
                'ma_nguoi_duoc_theo_doi' => $user->ma_nguoi_dung,
                'ngay_theo_doi' => Carbon::now(),
                'trang_thai' => 1
            ]);
        }
    }
}