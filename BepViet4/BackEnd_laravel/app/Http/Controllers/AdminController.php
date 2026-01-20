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
        
        return response()->json([
            'total_users' => NguoiDung::count(),
            'total_recipes' => CongThuc::count(),
            'pending_recipes' => CongThuc::where('trang_thai', 'pending')->count(),
            'reports' => DB::table('bao_cao')->count(),
            'system_status' => '99.9%'
        ]);
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
