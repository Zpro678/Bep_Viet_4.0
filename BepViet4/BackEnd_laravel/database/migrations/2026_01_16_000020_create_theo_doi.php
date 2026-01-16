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
    Schema::create('theo_doi', function (Blueprint $table) {
        // 1. Khai báo 2 cột khóa ngoại
        $table->unsignedInteger('ma_nguoi_theo_doi'); // Người bấm follow
        $table->unsignedInteger('ma_nguoi_duoc_theo_doi'); // Người được follow
        
        // 2. Các cột dữ liệu khác
        $table->dateTime('ngay_theo_doi')->useCurrent(); // [cite: 153]
        $table->boolean('trang_thai')->default(1); // 1: Đang follow, 0: Unfollow [cite: 153]
        
        // 3. Tạo Khóa chính phức hợp (Composite Primary Key)
        // Để đảm bảo A không thể follow B 2 lần trong database
        $table->primary(['ma_nguoi_theo_doi', 'ma_nguoi_duoc_theo_doi']);

        // 4. Ràng buộc Khóa ngoại (Foreign Keys)
        $table->foreign('ma_nguoi_theo_doi')
              ->references('ma_nguoi_dung')->on('nguoi_dung')
              ->onDelete('cascade'); // Xóa user thì xóa luôn dữ liệu follow của họ

        $table->foreign('ma_nguoi_duoc_theo_doi')
              ->references('ma_nguoi_dung')->on('nguoi_dung')
              ->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('theo_doi');
    }
};
