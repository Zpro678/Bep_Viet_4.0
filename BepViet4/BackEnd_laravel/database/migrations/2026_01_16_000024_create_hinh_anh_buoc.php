<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
  // File: 2026_01_15_xxxxxx_create_hinh_anh_buoc_table.php

public function up(): void
{
    Schema::create('hinh_anh_buoc', function (Blueprint $table) {
        $table->increments('ma_hinh_anh');
        $table->unsignedInteger('ma_buoc'); // FK tham chiếu BuocThucHien
        
        $table->text('duong_dan')->nullable();
        $table->text('mo_ta'); // Bắt buộc
        
        $table->timestamps();

        // Ràng buộc: Xóa bước -> xóa ảnh minh họa bước đó
        $table->foreign('ma_buoc')
              ->references('ma_buoc')->on('buoc_thuc_hien')
              ->onDelete('cascade');
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hinh_anh_buoc');
    }
};
