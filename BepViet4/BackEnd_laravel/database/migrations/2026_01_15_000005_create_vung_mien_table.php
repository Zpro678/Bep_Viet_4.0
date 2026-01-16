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
    Schema::create('vung_mien', function (Blueprint $table) {
        // ma_vung_mien: Primary Key
        $table->increments('ma_vung_mien');

        // ten_vung_mien: Unique, Not Null
        $table->string('ten_vung_mien', 100)->unique();

        // mo_ta: Text, Nullable
        $table->text('mo_ta')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vung_mien');
    }
};
