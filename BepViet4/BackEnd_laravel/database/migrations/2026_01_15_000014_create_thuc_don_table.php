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
        Schema::create('thuc_don', function (Blueprint $table) {
            $table->increments('ma_thuc_don');

            $table->unsignedInteger('ma_nguoi_dung');

            $table->unsignedInteger('ma_cong_thuc');

            $table->date('ngay_an');

            $table->enum('buoi', ['Sáng', 'Trưa', 'Tối', 'Phụ']);

            $table->timestamps();
            
            $table->foreign('ma_nguoi_dung')->references('ma_nguoi_dung')->on('nguoi_dung')->onDelete('cascade');
            $table->foreign('ma_cong_thuc')->references('ma_cong_thuc')->on('cong_thuc')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_thuc_don');
    }
};
