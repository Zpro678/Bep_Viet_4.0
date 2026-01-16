<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CongThucThe extends Model
{
    use HasFactory;
    protected $table = 'cong_thuc_the';
    public $incrementing = false;
    protected $primaryKey = ['ma_cong_thuc', 'ma_the'];
    public $timestamps = true;
    protected $fillable = [
        'ma_cong_thuc',
        'ma_the',
    ];
    public function congThuc()
    {
        return $this->belongsTo(CongThuc::class, 'ma_cong_thuc', 'ma_cong_thuc');
    }
    public function the()
    {
        return $this->belongsTo(The::class, 'ma_the', 'ma_the');
    }
}