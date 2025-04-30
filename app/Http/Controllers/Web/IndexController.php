<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Auth;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return view('user.dashboard', ['api_access_token' => $token]);
    }

    public function createNew(){
        
        return view('task.create-task');
    }
}
