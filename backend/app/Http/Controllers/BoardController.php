<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Folder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BoardController extends Controller
{
    /**
     * GET /api/boards/{id}
     * Contexto: Al hacer click en un board
     * Obtener board completo con columns, tasks, usuarios asignados
     */
    public function show(Board $board)
    {
        // Verificar que el usuario tiene acceso al board
        $hasAccess = DB::table('group_user')
            ->join('folders', 'group_user.group_id', '=', 'folders.group_id')
            ->where('folders.id', $board->folder_id)
            ->where('group_user.user_id', auth()->id())
            ->exists();

        if (!$hasAccess) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $board->load([
            'folder.group',
            'columns' => function($query) {
                $query->orderBy('position');
            },
            'columns.tasks' => function($query) {
                $query->orderBy('position');
            },
            'columns.tasks.assignedUsers:id,name,email',
            'columns.tasks.state:id,name,color'
        ]);

        return response()->json($board, 200);
    }

    /**
     * POST /api/boards
     * Crear board (crea 3 columnas por defecto)
     */

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:20',
            'folder_id' => 'nullable|exists:folders,id',
            'group_id' => 'required_without:folder_id|exists:groups,id',
        ]);

        // Si no se proporciona folder_id, usar el folder "root" del grupo
        if (!$request->folder_id) {
            $folder = Folder::where('group_id', $request->group_id)
                ->where('name', 'root')
                ->firstOrFail();
        } else {
            $folder = Folder::findOrFail($request->folder_id);
        }

        // Verificar acceso al grupo
        $hasAccess = DB::table('group_user')
            ->where('group_id', $folder->group_id)
            ->where('user_id', auth()->id())
            ->exists();

        if (!$hasAccess) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        DB::beginTransaction();
        try {
            // Crear board
            $board = Board::create([
                'name' => $request->name,
                'color' => $request->color ?? '#3B82F6',
                'folder_id' => $folder->id,
            ]);

            // Crear 3 columnas por defecto
            $defaultColumns = [
                ['name' => 'Pendiente', 'color' => '#64748B', 'position' => 1024.0],
                ['name' => 'En Proceso', 'color' => '#3B82F6', 'position' => 2048.0],
                ['name' => 'Completado', 'color' => '#10B981', 'position' => 3072.0],
            ];

            foreach ($defaultColumns as $columnData) {
                $board->columns()->create($columnData);
            }

            // Recargar con columnas
            $board->load('columns');

            DB::commit();
            return response()->json($board, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al crear el board',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //         'color' => 'nullable|string|max:20',
    //         'folder_id' => 'required|exists:folders,id',
    //     ]);

    //     // Verificar acceso al folder
    //     $folder = Folder::find($request->folder_id);
    //     $hasAccess = DB::table('group_user')
    //         ->where('group_id', $folder->group_id)
    //         ->where('user_id', auth()->id())
    //         ->exists();

    //     if (!$hasAccess) {
    //         return response()->json(['message' => 'No autorizado'], 403);
    //     }

    //     DB::beginTransaction();
    //     try {
    //         // Crear board
    //         $board = Board::create([
    //             'name' => $request->name,
    //             'color' => $request->color ?? '#3B82F6',
    //             'folder_id' => $request->folder_id,
    //         ]);

    //         // Crear 3 columnas por defecto
    //         $defaultColumns = [
    //             ['name' => 'Pendiente', 'color' => '#64748B', 'position' => 1024.0],
    //             ['name' => 'En Proceso', 'color' => '#3B82F6', 'position' => 2048.0],
    //             ['name' => 'Completado', 'color' => '#10B981', 'position' => 3072.0],
    //         ];

    //         foreach ($defaultColumns as $columnData) {
    //             $board->columns()->create($columnData);
    //         }

    //         // Recargar con columnas
    //         $board->load('columns');

    //         DB::commit();
    //         return response()->json($board, 201);
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         return response()->json([
    //             'message' => 'Error al crear el board',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    /**
     * PUT /api/boards/{id}
     * Actualizar board
     */
    public function update(Request $request, Board $board)
    {
        // Verificar acceso
        $hasAccess = DB::table('group_user')
            ->join('folders', 'group_user.group_id', '=', 'folders.group_id')
            ->where('folders.id', $board->folder_id)
            ->where('group_user.user_id', auth()->id())
            ->exists();

        if (!$hasAccess) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'color' => 'nullable|string|max:20',
        ]);

        $board->update($request->only(['name', 'color']));

        return response()->json($board, 200);
    }

    /**
     * DELETE /api/boards/{id}
     * Eliminar board
     */
    public function destroy(Board $board)
    {
        // Verificar acceso
        $hasAccess = DB::table('group_user')
            ->join('folders', 'group_user.group_id', '=', 'folders.group_id')
            ->where('folders.id', $board->folder_id)
            ->where('group_user.user_id', auth()->id())
            ->exists();

        if (!$hasAccess) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $board->delete();

        return response()->noContent();
    }

    /**
     * GET /api/boards/{id}/logs
     * Obtener historial de actividades del board
     */
    public function logs(Board $board)
    {
        // Verificar acceso
        $hasAccess = DB::table('group_user')
            ->join('folders', 'group_user.group_id', '=', 'folders.group_id')
            ->where('folders.id', $board->folder_id)
            ->where('group_user.user_id', auth()->id())
            ->exists();

        if (!$hasAccess) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $logs = $board->logs()
            ->with('user:id,name,email')
            ->limit(50)
            ->get();

        return response()->json([
            'board_id' => $board->id,
            'total' => $board->logs()->count(),
            'logs' => $logs
        ], 200);
    }

    /**
     * GET /api/boards/{id}/stats
     * Estadísticas del board
     */
    public function stats(Board $board)
    {
        // Verificar acceso
        $hasAccess = DB::table('group_user')
            ->join('folders', 'group_user.group_id', '=', 'folders.group_id')
            ->where('folders.id', $board->folder_id)
            ->where('group_user.user_id', auth()->id())
            ->exists();

        if (!$hasAccess) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $tasksCount = DB::table('tasks')
            ->join('columns', 'tasks.column_id', '=', 'columns.id')
            ->where('columns.board_id', $board->id)
            ->count();

        $completedTasks = DB::table('tasks')
            ->join('columns', 'tasks.column_id', '=', 'columns.id')
            ->join('states', 'tasks.state_id', '=', 'states.id')
            ->where('columns.board_id', $board->id)
            ->whereIn('states.name', ['Completada', 'Hecho', 'Done', 'Completado'])
            ->count();

        $tasksByColumn = DB::table('tasks')
            ->join('columns', 'tasks.column_id', '=', 'columns.id')
            ->where('columns.board_id', $board->id)
            ->select('columns.name as column', DB::raw('count(*) as count'))
            ->groupBy('columns.name')
            ->get();

        return response()->json([
            'board_id' => $board->id,
            'tasks_count' => $tasksCount,
            'completed_tasks' => $completedTasks,
            'tasks_by_column' => $tasksByColumn,
        ], 200);
    }
}
