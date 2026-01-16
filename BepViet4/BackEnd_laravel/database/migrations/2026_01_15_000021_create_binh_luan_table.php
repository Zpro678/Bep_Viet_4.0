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
        Schema::create('binh_luan', function (Blueprint $table) {
            // ma_binh_luan: Primary key, Identity(1,1)
            $table->increments('ma_binh_luan');

            // ma_nguoi_dung: Integer, Foreign Key (ref NguoiDung)
            $table->integer('ma_nguoi_dung');

            // ma_cong_thuc: Integer, Foreign Key (ref CongThuc)
            $table->integer('ma_cong_thuc');

            $table->unsignedInteger('ma_binh_luan_cha')->nullable(); // Có thể null nếu là comment gốc

            // noi_dung: Text (NVARCHAR MAX), not null
            $table->text('noi_dung');

            // ngay_gui: DateTime, Default GetDate()
            $table->dateTime('ngay_gui')->useCurrent();

            $table->timestamps(); // created_at and updated_at

            // Khóa ngoại
            $table->foreign('ma_nguoi_dung')->references('ma_nguoi_dung')->on('nguoi_dung')->onDelete('cascade');
            $table->foreign('ma_cong_thuc')->references('ma_cong_thuc')->on('cong_thuc')->onDelete('cascade');

            // Tự tham chiếu chính nó (Bình luận con trỏ tới Bình luận cha)
            $table->foreign('ma_binh_luan_cha')->references('ma_binh_luan')->on('binh_luan')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('binh_luan');
    }
};
