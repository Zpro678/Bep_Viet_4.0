<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class DetailSeeder extends Seeder
{
    public function run()
    {
        
        $congThuc = DB::table('cong_thuc')->first();
        $ctId = $congThuc->ma_cong_thuc;
        $nguyenLieuId = DB::table('nguyen_lieu')->first()->ma_nguyen_lieu;
        $theId = DB::table('the')->first()->ma_the;
        $baiVietId = DB::table('bai_viet')->first()->ma_bai_viet;

      
        $buocId = DB::table('buoc_thuc_hien')->insertGetId([
            'ma_cong_thuc' => $ctId,
            'so_thu_tu' => 1,
            'noi_dung' => 'Sơ chế cá sạch sẽ, cắt khúc vừa ăn.',
            'thoi_gian' => 10
        ]);

       
        DB::table('cong_thuc_nguyen_lieu')->insert([
            'ma_cong_thuc' => $ctId,
            'ma_nguyen_lieu' => $nguyenLieuId,
            'dinh_luong' => 500,
            'don_vi_tinh' => 'gram'
        ]);

     
        DB::table('cong_thuc_the')->insert([
            'ma_cong_thuc' => $ctId,
            'ma_the' => $theId
        ]);

      
        DB::table('video_huong_dan')->insert([
            'ma_cong_thuc' => $ctId,
            'tieu_de_video' => 'Hướng dẫn nấu canh chua',
            'duong_dan_video' => 'https://youtube.com/watch?v=xyz',
            'nen_tang' => 'Youtube',
            'la_video_chinh' => 1
        ]);


        DB::table('hinh_anh_cong_thuc')->insert([
            'ma_cong_thuc' => $ctId,
            'duong_dan' => 'canhchua.jpg',
            'mo_ta' => 'Thành phẩm'
        ]);


        DB::table('hinh_anh_buoc')->insert([
            'ma_buoc' => $buocId,
            'duong_dan' => 'buoc1.jpg',
            'mo_ta' => 'Sơ chế cá'
        ]);

        
        DB::table('hinh_anh_bai_viet')->insert([
            'ma_bai_viet' => $baiVietId,
            'duong_dan' => 'blog_cover.jpg',
            'mo_ta' => 'Ảnh bìa bài viết'
        ]);
    }
}