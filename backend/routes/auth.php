<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest')
    ->name('register');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest')
    ->name('login');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest')
    ->name('password.email');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->middleware('guest')
    ->name('password.store');

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth', 'signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth', 'throttle:6,1'])
    ->name('verification.send');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// Route::middleware(['auth:sanctum'])->group(function () {

//     // ------------------------------------------------------------------------
//     // USERS
//     // ------------------------------------------------------------------------
//     Route::get('/users/profile', [UserController::class, 'profile']);
//     Route::get('/users/tasks', [UserController::class, 'tasks']); // Con filtros opcionales

//     // ------------------------------------------------------------------------
//     // GROUPS (Workspaces/Equipos)
//     // ------------------------------------------------------------------------
//     Route::get('/groups', [GroupController::class, 'index']); // Sidebar: grupos con folders y boards
//     Route::post('/groups', [GroupController::class, 'store']);
//     Route::get('/groups/{group}', [GroupController::class, 'show']);
//     Route::put('/groups/{group}', [GroupController::class, 'update']);
//     Route::delete('/groups/{group}', [GroupController::class, 'destroy']);
    
//     // Gestión de miembros
//     Route::post('/groups/{group}/members', [GroupController::class, 'addMember']);
//     Route::delete('/groups/{group}/members/{userId}', [GroupController::class, 'removeMember']);
//     Route::get('/groups/{group}/members', [GroupController::class, 'members']);
    
//     // Estadísticas
//     Route::get('/groups/{group}/stats', [GroupController::class, 'stats']);

//     // ------------------------------------------------------------------------
//     // FOLDERS (Carpetas)
//     // ------------------------------------------------------------------------
//     Route::get('/folders', [FolderController::class, 'index']);
//     Route::post('/folders', [FolderController::class, 'store']);
//     Route::get('/folders/{folder}', [FolderController::class, 'show']);
//     Route::put('/folders/{folder}', [FolderController::class, 'update']);
//     Route::delete('/folders/{folder}', [FolderController::class, 'destroy']);

//     // ------------------------------------------------------------------------
//     // BOARDS (Tableros)
//     // ------------------------------------------------------------------------
//     Route::get('/boards/{board}', [BoardController::class, 'show']); // Principal: board completo
//     Route::post('/boards', [BoardController::class, 'store']);
//     Route::put('/boards/{board}', [BoardController::class, 'update']);
//     Route::delete('/boards/{board}', [BoardController::class, 'destroy']);
    
//     // Logs y estadísticas
//     Route::get('/boards/{board}/logs', [BoardController::class, 'logs']);
//     Route::get('/boards/{board}/stats', [BoardController::class, 'stats']);

//     // ------------------------------------------------------------------------
//     // COLUMNS (Columnas)
//     // ------------------------------------------------------------------------
//     Route::post('/columns', [ColumnController::class, 'store']);
//     Route::put('/columns/{column}', [ColumnController::class, 'update']);
//     Route::delete('/columns/{column}', [ColumnController::class, 'destroy']);
    
//     // Reordenamiento
//     Route::put('/columns/{column}/reorder', [ColumnController::class, 'reorder']);
//     Route::post('/columns/batch-reorder', [ColumnController::class, 'batchReorder']);

//     // ------------------------------------------------------------------------
//     // TASKS (Tareas/Tarjetas)
//     // ------------------------------------------------------------------------
//     Route::get('/tasks/{task}', [TaskController::class, 'show']);
//     Route::post('/tasks', [TaskController::class, 'store']);
//     Route::put('/tasks/{task}', [TaskController::class, 'update']);
//     Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
    
//     // Reordenamiento y movimiento
//     Route::put('/tasks/{task}/reorder', [TaskController::class, 'reorder']);
//     Route::put('/tasks/{task}/move', [TaskController::class, 'move']);
//     Route::post('/tasks/batch-reorder', [TaskController::class, 'batchReorder']);
    
//     // Asignaciones de usuarios
//     Route::post('/tasks/{task}/assign', [TaskController::class, 'assign']);
//     Route::delete('/tasks/{task}/assign/{userId}', [TaskController::class, 'unassign']);
//     Route::get('/tasks/{task}/assigned-users', [TaskController::class, 'assignedUsers']);
    
//     // Logs
//     Route::get('/tasks/{task}/logs', [TaskController::class, 'logs']);

// });