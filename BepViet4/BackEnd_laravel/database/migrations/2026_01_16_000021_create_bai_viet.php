<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   // File: 2026_01_15_xxxxxx_create_bai_viet_table.php

public function up(): void
{
    Schema::create('bai_viet', function (Blueprint $table) {
        $table->increments('ma_bai_viet'); // PK, Identity

        // Khóa ngoại
        $table->unsignedInteger('ma_nguoi_dung');
        
        // Cột dữ liệu
        $table->string('tieu_de', 255);
        $table->text('noi_dung'); // NVARCHAR(MAX)
        $table->text('hinh_anh_dai_dien')->nullable();
        
        // Mặc định thời gian hiện tại
        $table->dateTime('ngay_dang')->useCurrent();
        $table->dateTime('ngay_chinh')->useCurrent();
        
        $table->integer('luot_yeu_thich')->default(0)->nullable();
        $table->integer('luot_chia_se')->default(0)->nullable();
        
        $table->timestamps(); // create_at, updated_at

        // Ràng buộc khóa ngoại
        $table->foreign('ma_nguoi_dung')
              ->references('ma_nguoi_dung')->on('nguoi_dung')
              ->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bai_viet');
    }
};
