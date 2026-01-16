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
        Schema::create('_chi_tiet_bo_suu_tap', function (Blueprint $table) {
            $table->integer('ma_bo_suu_tap');

            $table->integer('ma_cong_thuc');

            $table->dateTime('ngay_them')->useCurrent();

            $table->string('ghi_chu', 255)->nullable();

            $table->timestamps();
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
