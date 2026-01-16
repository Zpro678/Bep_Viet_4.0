<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class VungMien extends Model {
    protected $table = 'VungMien';
    protected $primaryKey = 'ma_vung_mien';
    public $timestamps = false;
    protected $fillable = ['ten_vung_mien', 'mo_ta'];
}