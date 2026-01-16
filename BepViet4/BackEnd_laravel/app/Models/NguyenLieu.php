<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NguyenLieu extends Model
{
    use HasFactory;

    protected $table = 'nguyen_lieu';
    protected $primaryKey = 'ma_nguyen_lieu';

    public $timestamps = false;

    protected $fillable = [
        'ten_nguyen_lieu',
        'loai_nguyen_lieu',
        'hinh_anh'
    ];
}