<?php

namespace App\Http\Controllers\Web\User;

use App\Http\Controllers\Controller;
use Auth;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Login page
     * @method GET
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function login(Request $request)
    {
        if (Auth::check())
            return redirect(route('task-dashboard'));

        return view('user.login', ['message' => $request->session()->get('error', null)]);
    }

    /**
     * Register new user
     * @method GET
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function register(Request $request)
    {

        return view('user.register');
    }

    /**
     * User Authentication
     * @method POST
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function userAuth(Request $request)
    {
        $response = ['error' => false];

        if (!$request->input('username') || !$request->input('passw')) {
            $response = [
                ...$response,
                'error' => true
            ];
        }

        $email = $request->input('username');

        if (Auth::attempt(["email" => $email, "password" => $request->input('passw')])) {
            return redirect('/');
        }

        return redirect('/login')->with('error', 'Invalid user authentication.');
    }

    /**
     * User logout that will redirect to login afterwards.
     * @method GET
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function logout(Request $request)
    {
        
        Auth::logout();

        return redirect(route('login'));
    }
}
