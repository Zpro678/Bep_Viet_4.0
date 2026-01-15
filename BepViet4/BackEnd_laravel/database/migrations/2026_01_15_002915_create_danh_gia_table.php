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
        Schema::create('danh_gia', function (Blueprint $table) {
            // ma_danh_gia: Primary Key, Identity(1,1)
            $table->increments('ma_danh_gia');

            // ma_nguoi_dung: Integer, Foreign Key
            $table->integer('ma_nguoi_dung');

            // ma_cong_thuc: Integer, Foreign Key
            $table->integer('ma_cong_thuc');

            // so_sao: Integer, Not Null (Check 1-5 thường xử lý ở logic code hoặc DB Raw)
            $table->integer('so_sao');

            // Ràng buộc Unique: Mỗi người chỉ đánh giá 1 món 1 lần (User + Recipe)
            $table->unique(['ma_nguoi_dung', 'ma_cong_thuc']);

            $table->timestamps(); // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('danh_gia');
    }
};