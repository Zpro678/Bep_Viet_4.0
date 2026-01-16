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
    Schema::create('video_huong_dan', function (Blueprint $table) {
        $table->increments('ma_video');
        $table->unsignedInteger('ma_cong_thuc'); // FK
        
        $table->string('tieu_de_video', 100);
        $table->text('duong_dan_video')->nullable(); // Link video
        $table->string('nen_tang', 200)->nullable(); // Youtube, TikTok...
        $table->integer('thoi_luong')->nullable(); // Tính bằng giây
        $table->boolean('la_video_chinh')->default(0); // 0: Phụ, 1: Chính
        
        $table->timestamps();

        // Ràng buộc
        $table->foreign('ma_cong_thuc')
              ->references('ma_cong_thuc')->on('cong_thuc')
              ->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_huong_dan');
    }
};
