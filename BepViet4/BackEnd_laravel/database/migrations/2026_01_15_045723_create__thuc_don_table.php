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
        Schema::create('_thuc_don', function (Blueprint $table) {
            $table->increments('ma_thuc_don');

            $table->integer('ma_nguoi_dung');

            $table->integer('ma_cong_thuc');

            $table->date('ngay_an');

            $table->enum('buoi', ['Sáng', 'Trưa', 'Tối', 'Phụ']);

            $table->timestamps();
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
