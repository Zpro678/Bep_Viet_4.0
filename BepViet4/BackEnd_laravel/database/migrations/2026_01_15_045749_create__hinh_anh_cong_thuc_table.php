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
        Schema::create('_hinh_anh_cong_thuc', function (Blueprint $table) {
            $table->increments('ma_hinh_anh');

            $table->text('duong_dan')->nullable();

            $table->text('mo_ta');

            $table->integer('ma_cong_thuc');

            $table->timestamps();
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
