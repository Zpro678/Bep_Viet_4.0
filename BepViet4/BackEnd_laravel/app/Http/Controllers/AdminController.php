<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CongThuc;

class AdminController extends Controller
{
    // AdminController.php

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
}
