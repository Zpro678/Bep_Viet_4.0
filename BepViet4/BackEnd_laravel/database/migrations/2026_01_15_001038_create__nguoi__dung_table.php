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
        Schema::create('_nguoi__dung', function (Blueprint $table) {
            // ma_nguoi_dung: Primary key, auto-increment integer
            $table->increments('ma_nguoi_dung');

            // ten_dang_nhap: String, unique, not null
            $table->string('ten_dang_nhap',100)->unique()->notNullable();
            
            // mat_khau: String, not null
            $table->string('mat_khau',255)->notNullable();

            //email: String, unique, not null
            $table->string('email',150)->unique()->notNullable();

            //ho_ten: String, not null
            $table->string('ho_ten',150)->notNUllable();

            //ngay_sinh: Date, nullable
            $table->date('ngay_sinh')->nullable();
            
            //gioi_tinh: Enum ('Nam', 'Nu', 'Khac'), default 'Khac'
            $table->enum('gioi_tinh', ['Nam', 'Nu', 'Khac'])->default('Khac');

            //vai_tro: Enum ('Admin', 'User', 'Blogger'), default 'User'
            $table->enum('vai_tro', ['Admin', 'User', 'Blogger'])->default('User');

            $table->timestamps(); // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        
        Schema::dropIfExists('_nguoi__dung');
    }
};
