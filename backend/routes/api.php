<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\GroupController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\ColumnController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes - OpenKanban
|--------------------------------------------------------------------------
*/

// Rutas públicas de autenticación están en routes/auth.php

// ============================================================================
// RUTAS PROTEGIDAS (Requieren autenticación)
// ============================================================================

Route::middleware(['auth:sanctum'])->group(function () {

    // ------------------------------------------------------------------------
    // USERS
    // ------------------------------------------------------------------------
    Route::get('/users/profile', [UserController::class, 'profile']);
    Route::get('/users/tasks', [UserController::class, 'tasks']); // Con filtros opcionales
    Route::get('/user/preferences', [UserController::class, 'getPreferences']);
    Route::put('/user/preferences', [UserController::class, 'updatePreferences']);

    // ------------------------------------------------------------------------
    // GROUPS (Workspaces/Equipos)
    // ------------------------------------------------------------------------
    Route::get('/groups', [GroupController::class, 'index']); // Sidebar: grupos con folders y boards
    Route::post('/groups', [GroupController::class, 'store']);
    Route::get('/groups/{group}', [GroupController::class, 'show']);
    Route::put('/groups/{group}', [GroupController::class, 'update']);
    Route::delete('/groups/{group}', [GroupController::class, 'destroy']);

    // Gestión de miembros
    Route::post('/groups/{group}/members', [GroupController::class, 'addMember']);
    Route::delete('/groups/{group}/members/{userId}', [GroupController::class, 'removeMember']);
    Route::get('/groups/{group}/members', [GroupController::class, 'members']);

    // Estadísticas
    Route::get('/groups/{group}/stats', [GroupController::class, 'stats']);

    // ------------------------------------------------------------------------
    // FOLDERS (Carpetas)
    // ------------------------------------------------------------------------
    Route::get('/folders', [FolderController::class, 'index']);
    Route::post('/folders', [FolderController::class, 'store']);
    Route::get('/folders/{folder}', [FolderController::class, 'show']);
    Route::put('/folders/{folder}', [FolderController::class, 'update']);
    Route::delete('/folders/{folder}', [FolderController::class, 'destroy']);

    // ------------------------------------------------------------------------
    // BOARDS (Tableros)
    // ------------------------------------------------------------------------
    Route::get('/boards/{board}', [BoardController::class, 'show']); // Principal: board completo
    Route::post('/boards', [BoardController::class, 'store']);
    Route::put('/boards/{board}', [BoardController::class, 'update']);
    Route::delete('/boards/{board}', [BoardController::class, 'destroy']);

    // Logs y estadísticas
    Route::get('/boards/{board}/logs', [BoardController::class, 'logs']);
    Route::get('/boards/{board}/stats', [BoardController::class, 'stats']);

    // ------------------------------------------------------------------------
    // COLUMNS (Columnas)
    // ------------------------------------------------------------------------
    Route::post('/columns', [ColumnController::class, 'store']);
    Route::put('/columns/{column}', [ColumnController::class, 'update']);
    Route::delete('/columns/{column}', [ColumnController::class, 'destroy']);

    // Reordenamiento
    Route::put('/columns/{column}/reorder', [ColumnController::class, 'reorder']);
    Route::post('/columns/batch-reorder', [ColumnController::class, 'batchReorder']);

    // ------------------------------------------------------------------------
    // TASKS (Tareas/Tarjetas)
    // ------------------------------------------------------------------------
    Route::get('/tasks/{task}', [TaskController::class, 'show']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::put('/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);

    // Reordenamiento y movimiento
    Route::put('/tasks/{task}/reorder', [TaskController::class, 'reorder']);
    Route::put('/tasks/{task}/move', [TaskController::class, 'move']);
    Route::post('/tasks/batch-reorder', [TaskController::class, 'batchReorder']);

    // Asignaciones de usuarios
    Route::post('/tasks/{task}/assign', [TaskController::class, 'assign']);
    Route::delete('/tasks/{task}/assign/{userId}', [TaskController::class, 'unassign']);
    Route::get('/tasks/{task}/assigned-users', [TaskController::class, 'assignedUsers']);

    // Logs
    Route::get('/tasks/{task}/logs', [TaskController::class, 'logs']);

    // ------------------------------------------------------------------------
    // COMMENTS (Comentarios con hilos)
    // ------------------------------------------------------------------------
    Route::get('/tasks/{taskId}/comments', [CommentController::class, 'index']);
    Route::post('/comments', [CommentController::class, 'store']);
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    // ------------------------------------------------------------------------
    // STATES (Estados de tareas)
    // ------------------------------------------------------------------------
    Route::get('/states', [StateController::class, 'index']);
    Route::post('/states', [StateController::class, 'store']);
    Route::put('/states/{state}', [StateController::class, 'update']);
    Route::delete('/states/{state}', [StateController::class, 'destroy']);

    // ------------------------------------------------------------------------
    // LOGS (Historial de actividades)
    // ------------------------------------------------------------------------
    Route::get('/logs', [LogController::class, 'index']); // Opcional: logs globales del usuario

});

/*
|--------------------------------------------------------------------------
| ENDPOINTS DISPONIBLES - RESUMEN
|--------------------------------------------------------------------------
| 
| AUTENTICACIÓN (en routes/auth.php):
|   POST   /api/register
|   POST   /api/login
|   POST   /api/logout
|   GET    /api/users/profile
| 
| GRUPOS:
|   GET    /api/groups (sidebar)
|   POST   /api/groups
|   GET    /api/groups/{id}
|   PUT    /api/groups/{id}
|   DELETE /api/groups/{id}
|   POST   /api/groups/{id}/members
|   DELETE /api/groups/{id}/members/{userId}
|   GET    /api/groups/{id}/members
|   GET    /api/groups/{id}/stats
| 
| FOLDERS:
|   GET    /api/folders
|   POST   /api/folders
|   GET    /api/folders/{id}
|   PUT    /api/folders/{id}
|   DELETE /api/folders/{id}
| 
| BOARDS:
|   GET    /api/boards/{id} (principal: carga completa)
|   POST   /api/boards
|   PUT    /api/boards/{id}
|   DELETE /api/boards/{id}
|   GET    /api/boards/{id}/logs
|   GET    /api/boards/{id}/stats
| 
| COLUMNS:
|   POST   /api/columns
|   PUT    /api/columns/{id}
|   DELETE /api/columns/{id}
|   PUT    /api/columns/{id}/reorder
|   POST   /api/columns/batch-reorder
| 
| TASKS:
|   GET    /api/tasks/{id}
|   POST   /api/tasks
|   PUT    /api/tasks/{id}
|   DELETE /api/tasks/{id}
|   PUT    /api/tasks/{id}/reorder
|   PUT    /api/tasks/{id}/move
|   POST   /api/tasks/batch-reorder
|   POST   /api/tasks/{id}/assign
|   DELETE /api/tasks/{id}/assign/{userId}
|   GET    /api/tasks/{id}/assigned-users
|   GET    /api/tasks/{id}/logs
| 
| COMMENTS:
|   GET    /api/tasks/{taskId}/comments
|   POST   /api/comments
|   PUT    /api/comments/{id}
|   DELETE /api/comments/{id}
| 
| STATES:
|   GET    /api/states
|   POST   /api/states
|   PUT    /api/states/{id}
|   DELETE /api/states/{id}
| 
| USERS:
|   GET    /api/users/profile
|   GET    /api/users/tasks (con filtros: ?state_id=1&group_id=2)
|
*/
