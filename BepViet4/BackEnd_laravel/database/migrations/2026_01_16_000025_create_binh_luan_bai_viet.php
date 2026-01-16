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
        Schema::create('binh_luan_bai_viet', function (Blueprint $table) {
            // 1. Khóa chính
            $table->increments('ma_binh_luan'); // Tương ứng IDENTITY(1,1)

            // 2. Các cột khóa ngoại
            $table->unsignedInteger('ma_nguoi_dung'); // Người bình luận
            $table->unsignedInteger('ma_bai_viet');   // Bình luận ở bài viết nào
            $table->unsignedInteger('ma_binh_luan_cha')->nullable(); // ID bình luận cha (Cho phép NULL nếu là comment gốc)

            // 3. Các cột dữ liệu
            $table->text('noi_dung'); // Nội dung bình luận (NVARCHAR(MAX))
            $table->dateTime('ngay_gui')->useCurrent(); // Mặc định lấy thời gian hiện tại

            $table->timestamps(); // created_at, updated_at

            // --- 4. RÀNG BUỘC KHÓA NGOẠI ---

            // Liên kết với bảng NguoiDung
            $table->foreign('ma_nguoi_dung')
                  ->references('ma_nguoi_dung')->on('nguoi_dung')
                  ->onDelete('cascade'); // Xóa user -> xóa bình luận của họ

            // Liên kết với bảng BaiViet
            $table->foreign('ma_bai_viet')
                  ->references('ma_bai_viet')->on('bai_viet')
                  ->onDelete('cascade'); // Xóa bài viết -> xóa toàn bộ bình luận trong bài

            // Liên kết Đệ quy (Self-Referencing) cho chức năng "Trả lời"
            $table->foreign('ma_binh_luan_cha')
                  ->references('ma_binh_luan')->on('binh_luan_bai_viet') // Tham chiếu chính bảng này
                  ->onDelete('cascade'); // Xóa comment cha -> xóa luôn các comment con (reply)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('binh_luan_bai_viet');
    }
};
