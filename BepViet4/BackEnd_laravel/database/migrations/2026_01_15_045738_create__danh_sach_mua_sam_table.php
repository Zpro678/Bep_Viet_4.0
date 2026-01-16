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
        Schema::create('_danh_sach_mua_sam', function (Blueprint $table) {
            $table->increments('ma_mua_sam');

            $table->integer('ma_nguoi_dung');

            $table->integer('ma_nguyen_lieu');

            $table->float('so_luong_can');

            $table->string('don_vi', 20);

            $table->boolean('trang_thai')->default(0);

            $table->timestamps();
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
