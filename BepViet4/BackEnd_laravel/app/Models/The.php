<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class The extends Model
{
    use HasFactory;

    protected $table = 'the';
    protected $primaryKey = 'ma_the';
    public $timestamps = false;

    protected $fillable = [
        'ten_the'
    ];
}
