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
    Schema::create('danh_muc', function (Blueprint $table) {
        // ma_danh_muc: Primary Key
        $table->increments('ma_danh_muc');

        // ten_danh_muc: Unique, Not Null
        $table->string('ten_danh_muc', 100)->unique();

        // mo_ta: Nullable
        $table->string('mo_ta', 255)->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('danh_muc');
    }
};
