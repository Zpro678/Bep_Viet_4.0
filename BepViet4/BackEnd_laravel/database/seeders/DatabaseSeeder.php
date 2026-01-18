<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        // Gọi các file theo thứ tự tạo dữ liệu để tránh lỗi khóa ngoại
        $this->call([
            MasterDataSeeder::class, 
            ContentSeeder::class,    
            DetailSeeder::class,     
            InteractionSeeder::class 
        ]);
    }
}
