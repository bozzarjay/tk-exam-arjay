<?php

use App\Http\Controllers\API\Task\TaskManagerController;
use App\Http\Controllers\Web\IndexController;
use App\Http\Controllers\Web\User\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/login', [UserController::class, 'login'])->name('login');
Route::post('/user/auth', [UserController::class, 'userAuth']);
Route::get('/register', [UserController::class, 'register']);

Route::middleware('auth')->group(function () {
    Route::get('/', [IndexController::class, 'index'])->name('task-dashboard');

    Route::group(['prefix' => 'user'], function () {
        Route::get('/logout', [UserController::class, 'logout'])->name('logout');
    });

    Route::group(['prefix' => 'task'], function () {
        Route::get('/create-new', [IndexController::class, 'createNew']);
    });
});