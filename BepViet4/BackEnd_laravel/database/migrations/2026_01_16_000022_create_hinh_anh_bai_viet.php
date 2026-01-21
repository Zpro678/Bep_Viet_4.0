<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hinh_anh_bai_viet', function (Blueprint $table) {
            // 1. Khóa chính
            $table->increments('ma_hinh_anh'); // Tương ứng IDENTITY(1,1)

            // 2. Khóa ngoại (liên kết với bài viết)
            $table->unsignedInteger('ma_bai_viet');

            // 3. Các cột dữ liệu
            $table->text('duong_dan');
            $table->text('mo_ta')->nullable(); 

            // Timestamp (tùy chọn nếu muốn theo dõi ngày tạo ảnh)
            // $table->timestamps();

            // 4. Thiết lập Ràng buộc Khóa ngoại
            $table->foreign('ma_bai_viet')
                  ->references('ma_bai_viet')->on('bai_viet')
                  ->onDelete('cascade'); 
            // Lưu ý: onDelete('cascade') giúp tự động xóa ảnh khi bài viết bị xóa
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hinh_anh_bai_viet');
    }
};
