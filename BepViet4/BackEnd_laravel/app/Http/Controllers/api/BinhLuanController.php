<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BinhLuanController extends Controller
{
    public function layBinhLuan(){
        return view('/lay-binh-luan');
    }
        
}
