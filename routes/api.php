<?php

use App\Http\Controllers\API\Task\TaskManagerController;
use App\Http\Controllers\API\User\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/user/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/task-list', [TaskManagerController::class, 'taskList']);
    Route::post('/task/create', [TaskManagerController::class, 'addTask']);
    Route::post('/task/status/update', [TaskManagerController::class, 'updateStatusTask']);
    Route::post('/task/publish/update', [TaskManagerController::class, 'publishTask']);
});
