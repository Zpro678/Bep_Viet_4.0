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
        // Tên bảng chuẩn nên là 'nguoi_dung' (hoặc 'users' nếu muốn đúng chuẩn Laravel)
        Schema::create('nguoi_dung', function (Blueprint $table) {

            // 1. ma_nguoi_dung: Primary key, auto-increment
            // Trong file yêu cầu là INT IDENTITY(1,1) 
            $table->increments('ma_nguoi_dung');

            // 2. ten_dang_nhap: VARCHAR(100), UNIQUE, NOT NULL 
            // Trong Laravel, không cần viết notNullable() vì mặc định đã là vậy.
            $table->string('ten_dang_nhap', 100)->unique();

            // 3. mat_khau: VARCHAR(100), NOT NULL 
            $table->string('mat_khau', 100);

            // 4. email: VARCHAR(50), UNIQUE, NOT NULL 
            $table->string('email', 50)->unique();

            // 5. ho_ten: NVARCHAR(100) -> string supports unicode by default
            $table->string('ho_ten', 100);

            // 6. ngay_sinh: DATE, NULLABLE (vì file không bắt buộc not null ở đây) 
            $table->date('ngay_sinh')->nullable();

            // 7. gioi_tinh: NVARCHAR(3), CHECK IN ('Nam', 'Nữ', 'Khác') 
            // Lưu ý: Dùng enum để giới hạn giá trị. File yêu cầu có dấu tiếng Việt (Nữ, Khác).
            $table->enum('gioi_tinh', ['Nam', 'Nữ', 'Khác'])->nullable();

            $table->enum('vai_tro', ['admin', 'member', 'blogger'])->default('member');

            $table->timestamps(); // created_at và updated_at
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::dropIfExists('_nguoi_dung');
    }
};
