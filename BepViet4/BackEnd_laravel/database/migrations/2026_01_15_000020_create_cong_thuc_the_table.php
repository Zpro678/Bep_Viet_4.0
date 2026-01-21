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
        Schema::create('cong_thuc_the', function (Blueprint $table) {
            // ma_cong_thuc: Integer, tham chiếu đến bảng CongThuc
            $table->unsignedInteger('ma_cong_thuc');
            $table->unsignedInteger('ma_the');

            $table->primary(['ma_cong_thuc', 'ma_the']);
          
            // created_at and updated_at
            $table->timestamps();

            // --- KHAI BÁO RÀNG BUỘC KHÓA NGOẠI ---
            $table->foreign('ma_cong_thuc')
                ->references('ma_cong_thuc')->on('cong_thuc')
                ->onDelete('cascade'); // Xóa công thức -> xóa dòng này

            $table->foreign('ma_the')
                ->references('ma_the')->on('the')
                ->onDelete('cascade'); // Xóa thẻ (tag) -> xóa dòng này
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cong_thuc_the');
    }
};
