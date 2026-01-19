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
        Schema::create('luot_thich', function (Blueprint $table) {
            $table->id(); // Khóa chính (tự tăng)
          
            $table->unsignedInteger('ma_nguoi_dung');
            
            $table->foreign('ma_nguoi_dung')
                  ->references('ma_nguoi_dung') 
                  ->on('nguoi_dung')
                  ->onDelete('cascade');

            // thich_id: Lưu ID của bài viết hoặc công thức
            // thich_type: Lưu tên Model (VD: App\Models\CongThuc)
            $table->morphs('thich');

            $table->timestamps(); 

            $table->unique(['ma_nguoi_dung', 'thich_id', 'thich_type'], 'user_like_unique');
        });

    }
    public function down(): void
    {
        Schema::dropIfExists('luot_thich');
    }
};
