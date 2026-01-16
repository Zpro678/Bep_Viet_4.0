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
        Schema::create('cong_thuc_nguyen_lieu', function (Blueprint $table) {
            // Bảng trung gian nên không dùng id()
            $table->unsignedInteger('ma_cong_thuc');
            $table->unsignedInteger('ma_nguyen_lieu');

            $table->float('dinh_luong')->unsigned();

            $table->string('don_vi_tinh', 50);

            // Khóa chính (2)
            $table->primary(['ma_cong_thuc', 'ma_nguyen_lieu']);

            // Khóa ngoại
            $table->foreign('ma_cong_thuc')
                  ->references('ma_cong_thuc')
                  ->on('cong_thuc')
                  ->onDelete('cascade');

            $table->foreign('ma_nguyen_lieu')
                  ->references('ma_nguyen_lieu')
                  ->on('nguyen_lieu')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cong_thuc_nguyen_lieu');
    }
};
