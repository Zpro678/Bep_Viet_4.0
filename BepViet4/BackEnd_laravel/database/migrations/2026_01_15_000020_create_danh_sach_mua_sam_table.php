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
        Schema::create('danh_sach_mua_sam', function (Blueprint $table) {
            $table->increments('ma_mua_sam');

            $table->unsignedInteger('ma_nguoi_dung');

            $table->unsignedInteger('ma_nguyen_lieu');

            $table->float('so_luong_can');

            $table->string('don_vi', 20);

            $table->boolean('trang_thai')->default(0);

            $table->timestamps();
            
            $table->foreign('ma_nguoi_dung')->references('ma_nguoi_dung')->on('nguoi_dung')->onDelete('cascade');
            
            $table->foreign('ma_nguyen_lieu')->references('ma_nguyen_lieu')->on('nguyen_lieu')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_danh_sach_mua_sam');
    }
};
