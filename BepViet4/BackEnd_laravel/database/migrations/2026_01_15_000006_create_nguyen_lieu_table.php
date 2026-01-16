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
        Schema::create('nguyen_lieu', function (Blueprint $table) {
             $table->increments('ma_nguyen_lieu'); // INT, PK, IDENTITY(1,1)

            $table->string('ten_nguyen_lieu', 255)
                  ->unique(); // UNIQUE, NOT NULL

            $table->string('loai_nguyen_lieu', 100); // NOT NULL

            $table->string('hinh_anh')->nullable(); // NULL
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nguyen_lieu');
    }
};
