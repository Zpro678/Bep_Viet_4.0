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
        Schema::create('bo_suu_tap', function (Blueprint $table) {
            // ma_bo_suu_tap: Primary Key, Identity(1,1)
            $table->increments('ma_bo_suu_tap');

            // ma_nguoi_dung: Integer, Foreign Key (Ref NguoiDung)
            $table->integer('ma_nguoi_dung');

            // ten_bo_suu_tap: NVARCHAR(100), Not Null
            $table->string('ten_bo_suu_tap', 100);

            $table->timestamps(); // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bo_suu_tap');
    }
};