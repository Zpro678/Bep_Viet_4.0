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
        Schema::create('hinh_anh_cong_thuc', function (Blueprint $table) {
            $table->increments('ma_hinh_anh');

            $table->unsignedInteger('ma_cong_thuc');

            $table->text('duong_dan')->nullable();

            $table->text('mo_ta');

            $table->timestamps();
            
            $table->foreign('ma_cong_thuc')->references('ma_cong_thuc')->on('cong_thuc')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_hinh_anh_cong_thuc');
    }
};
