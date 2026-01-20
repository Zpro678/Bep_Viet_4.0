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
    Schema::create('cong_thuc', function (Blueprint $table) {
        // ma_cong_thuc: Primary Key
        $table->increments('ma_cong_thuc');

        // 1. Các cột liên kết (Khóa ngoại)
        // ma_nguoi_dung: Not Null (theo tài liệu)
        // Dùng unsignedInteger để khớp với increments() của bảng nguoi_dung
        $table->unsignedInteger('ma_nguoi_dung'); 

        // ma_danh_muc: Nullable (Có thể null theo thiết kế tùy chọn)
        $table->unsignedInteger('ma_danh_muc')->nullable();

        // ma_vung_mien: Nullable
        $table->unsignedInteger('ma_vung_mien')->nullable();

        // 2. Thông tin chính
        // ten_mon: String 200, Not Null
        $table->string('ten_mon', 200);

        // mo_ta: Text, Nullable
        $table->text('mo_ta')->nullable();
        $table->enum('trang_thai', ['cho_duyet', 'cong_khai', 'tu_choi', 'nhap'])
        ->default('cho_duyet');
        // 3. Thông số nấu nướng
        // thoi_gian_nau: Int, Nullable
        $table->integer('thoi_gian_nau')->nullable();

        // khau_phan: Int, Nullable
        $table->integer('khau_phan')->nullable();

        // do_kho: Int (1-5), Nullable
        // Dùng tinyInteger cho tiết kiệm vì số nhỏ
        $table->tinyInteger('do_kho')->nullable();

        // 4. Thời gian
        // ngay_tao: DateTime, Default Current Timestamp
        $table->dateTime('ngay_tao')->useCurrent();

        $table->timestamps();

        // Ràng buộc khóa
        $table->foreign('ma_nguoi_dung')
              ->references('ma_nguoi_dung')->on('nguoi_dung')
              ->onDelete('cascade'); // Xóa user thì xóa luôn công thức

        $table->foreign('ma_danh_muc')
              ->references('ma_danh_muc')->on('danh_muc')
              ->onDelete('set null'); // Xóa danh mục thì để null

        $table->foreign('ma_vung_mien')
              ->references('ma_vung_mien')->on('vung_mien')
              ->onDelete('set null');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cong_thuc');
    }
};
