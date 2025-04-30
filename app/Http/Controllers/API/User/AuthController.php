<?php

namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Auth;
use Exception;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Request;

class AuthController extends Controller
{

    /** 
     * Register new user.
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function register(Request $request)
    {
        $data = $request->all();

        // Validation 
        if (!$data['fullname'] || !$data['email'] || !$data['pass']) {
            return response()->json('Invalid user parameter.', 400);
        }

        try {
            User::create([
                'name' => $data['fullname'],
                "email" => $data['email'],
                "password" => $data['pass']
            ]);

            return response()->json(['redirectTo' => route('login')]);

        } catch (UniqueConstraintViolationException $e) {
            return response()->json(['fail' => 'Email is already exist.'], 400);
        }
    }
}
