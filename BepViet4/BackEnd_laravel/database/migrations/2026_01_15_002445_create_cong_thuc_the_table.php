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
            $table->integer('ma_cong_thuc');

            // ma_the: Integer, tham chiếu đến bảng The
            $table->integer('ma_the');

            // created_at and updated_at
            $table->timestamps();
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