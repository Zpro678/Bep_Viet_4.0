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
        Schema::create('chi_tiet_bo_suu_tap', function (Blueprint $table) {
            $table->unsignedInteger('ma_bo_suu_tap');
           
            $table->unsignedInteger('ma_cong_thuc');

            $table->dateTime('ngay_them')->useCurrent();

            $table->string('ghi_chu', 255)->nullable();

            $table->primary(['ma_bo_suu_tap', 'ma_cong_thuc']);
            
            $table->timestamps();

            $table->foreign('ma_bo_suu_tap')->references('ma_bo_suu_tap')->on('bo_suu_tap')->onDelete('cascade');
           
            $table->foreign('ma_cong_thuc')->references('ma_cong_thuc')->on('cong_thuc')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_chi_tiet_bo_suu_tap');
    }
};
