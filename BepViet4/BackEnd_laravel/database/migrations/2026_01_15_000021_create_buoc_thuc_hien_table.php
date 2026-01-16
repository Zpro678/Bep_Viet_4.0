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
        Schema::create('buoc_thuc_hien', function (Blueprint $table) {
            $table->id('ma_buoc'); // INT, PK, IDENTITY(1,1)

            $table->unsignedBigInteger('ma_cong_thuc'); // FK
            
            $table->integer('so_thu_tu')
                  ->check('so_thu_tu > 0');

            $table->text('noi_dung'); // TEXT, NOT NULL

            // Thời gian thực hiện (phút)
            $table->integer('thoi_gian')
                  ->default(0)
                  ->check('thoi_gian >= 0');

            // Khóa ngoại
            $table->foreign('ma_cong_thuc')
                  ->references('ma_cong_thuc')
                  ->on('cong_thuc')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buoc_thuc_hien');
    }
};
