<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CongThuc;
use App\Models\NguoiDung;
use Illuminate\Support\Facades\DB;
class AdminController extends Controller
{


    public function getCongThucChoDuyet()
    {
        $recipes = CongThuc::with('nguoiTao')
            ->where('trang_thai', 'cho_duyet')
            ->whereExists(function ($q) {
                $q->select(DB::raw(1))
                  ->from('hinh_anh_cong_thuc')
                  ->whereColumn(
                      'hinh_anh_cong_thuc.ma_cong_thuc',
                      'cong_thuc.ma_cong_thuc'
                  );
            })
            ->orderBy('created_at', 'asc')
            ->paginate(20);
    
        return response()->json([
            'status' => 'success',
            'data' => $recipes
        ]);
    }
    

public function DuyetCongThuc($id) 
{
    $recipe = CongThuc::find($id);
    if ($recipe) {
        $recipe->trang_thai = 'cong_khai'; 
        $recipe->save();
        return response()->json(['message' => 'Đã duyệt bài viết']);
    }
}

public function getStatistical()
{
    $data = DB::table(DB::raw('(SELECT 1) as dummy'))
        ->select([
            DB::raw('(SELECT COUNT(*) FROM nguoi_dung) as total_users'),
            DB::raw('(SELECT COUNT(*) FROM cong_thuc) as total_recipes'),
            DB::raw("(SELECT COUNT(*) FROM cong_thuc WHERE trang_thai = 'cho_duyet') as pending_recipes"),
            DB::raw('(SELECT COUNT(*) FROM bao_cao) as reports'),
            DB::raw("'99.9%' as system_status"),
        ])
        ->first();

    return response()->json($data);
}


    public function getRecipeInWeek()
    {
        $data = CongThuc::select(DB::raw('DATE(ngay_tao) as date'), DB::raw('count(*) as value'))
            ->where('ngay_tao', '>=', now()->subDays(7))
            ->groupBy('date')
            ->get();
            
        return response()->json($data);
    }
}
