<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rutas API para los controladores
use App\Http\Controllers\GroupController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\ColumnController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LogController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


// Definición de rutas API

Route::apiResource('groups', GroupController::class);
Route::apiResource('folders', FolderController::class);
Route::apiResource('boards', BoardController::class);
Route::apiResource('columns', ColumnController::class);
Route::apiResource('tasks', TaskController::class);
Route::apiResource('states', StateController::class);
Route::apiResource('comments', CommentController::class);
Route::apiResource('logs', LogController::class);

Route::get('/user/tasks', [UserController::class, 'tasks']);
Route::get('/user/{user}', [UserController::class, 'show']);
Route::get('/user', [UserController::class, 'index']);