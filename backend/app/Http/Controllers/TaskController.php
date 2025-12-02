<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Column;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    /**
     * GET /api/tasks/{id}
     * Obtener tarea con detalles completos
     */
    public function show(Task $task)
    {
        // Verificar acceso
        if (!$this->userHasAccess($task)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $task->load([
            'column.board.folder.group',
            'state:id,name,color',
            'creator:id,name,email',
            'assignedUsers:id,name,email',
        ]);

        $task->comments_count = $task->comments()->count();
        $task->logs_count = $task->logs()->count();

        return response()->json($task, 200);
    }

    /**
     * POST /api/tasks
     * Crear tarea
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:20',
            'column_id' => 'required|exists:columns,id',
            'state_id' => 'required|exists:states,id',
            'position' => 'required|numeric',
        ]);

        // Verificar acceso a la columna
        $column = Column::findOrFail($request->column_id);
        if (!$this->userHasAccessToColumn($column)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $task = Task::create([
            'name' => $request->name,
            'description' => $request->description,
            'color' => $request->color ?? '#3B82F6',
            'column_id' => $request->column_id,
            'state_id' => $request->state_id,
            'creator_id' => auth()->id(),
            'position' => $request->position,
        ]);

        $task->load(['state:id,name,color', 'assignedUsers:id,name,email']);

        return response()->json($task, 201);
    }

    /**
     * PUT /api/tasks/{id}
     * Actualizar tarea
     */
    public function update(Request $request, Task $task)
    {
        if (!$this->userHasAccess($task)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:20',
            'state_id' => 'sometimes|exists:states,id',
        ]);

        $task->update($request->only(['name', 'description', 'color', 'state_id']));

        return response()->json($task, 200);
    }

    /**
     * DELETE /api/tasks/{id}
     * Eliminar tarea
     */
    public function destroy(Task $task)
    {
        if (!$this->userHasAccess($task)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $task->delete();

        return response()->noContent();
    }

    /**
     * PUT /api/tasks/{id}/reorder
     * Reordenar tarea dentro de la misma columna
     */
    public function reorder(Request $request, Task $task)
    {
        if (!$this->userHasAccess($task)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'position' => 'required|numeric',
        ]);

        $task->update(['position' => $request->position]);

        return response()->json([
            'id' => $task->id,
            'position' => $task->position,
            'message' => 'Tarea reordenada'
        ], 200);
    }

    /**
     * PUT /api/tasks/{id}/move
     * Mover tarea a otra columna
     */
    public function move(Request $request, Task $task)
    {
        if (!$this->userHasAccess($task)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'column_id' => 'required|exists:columns,id',
            'position' => 'required|numeric',
        ]);

        // Verificar acceso a la nueva columna
        $newColumn = Column::findOrFail($request->column_id);
        if (!$this->userHasAccessToColumn($newColumn)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $task->update([
            'column_id' => $request->column_id,
            'position' => $request->position,
        ]);

        return response()->json([
            'id' => $task->id,
            'column_id' => $task->column_id,
            'position' => $task->position,
            'message' => "Tarea movida a '{$newColumn->name}'"
        ], 200);
    }

    /**
     * POST /api/tasks/batch-reorder
     * Reordenar múltiples tareas (drag & drop)
     */
    public function batchReorder(Request $request)
    {
        $request->validate([
            'tasks' => 'required|array',
            'tasks.*.id' => 'required|exists:tasks,id',
            'tasks.*.column_id' => 'required|exists:columns,id',
            'tasks.*.position' => 'required|numeric',
        ]);

        DB::beginTransaction();
        try {
            $updated = 0;
            foreach ($request->tasks as $taskData) {
                $task = Task::find($taskData['id']);
                
                if (!$this->userHasAccess($task)) {
                    continue; // Skip tasks without access
                }

                $task->update([
                    'column_id' => $taskData['column_id'],
                    'position' => $taskData['position'],
                ]);
                $updated++;
            }

            DB::commit();
            return response()->json([
                'message' => 'Tareas reordenadas',
                'updated' => $updated
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al reordenar tareas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/tasks/{id}/assign
     * Asignar usuario a tarea
     */
    public function assign(Request $request, Task $task)
    {
        if (!$this->userHasAccess($task)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::findOrFail($request->user_id);

        // Verificar si ya está asignado
        if ($task->assignedUsers->contains($user->id)) {
            return response()->json([
                'message' => 'El usuario ya está asignado a esta tarea'
            ], 400);
        }

        $task->assignedUsers()->attach($user->id);

        return response()->json([
            'message' => 'Usuario asignado a la tarea',
            'task_id' => $task->id,
            'user' => $user->only(['id', 'name', 'email'])
        ], 200);
    }

    /**
     * DELETE /api/tasks/{id}/assign/{userId}
     * Desasignar usuario de tarea
     */
    public function unassign(Task $task, $userId)
    {
        if (!$this->userHasAccess($task)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $task->assignedUsers()->detach($userId);

        return response()->json([
            'message' => 'Usuario desasignado de la tarea'
        ], 200);
    }

    /**
     * GET /api/tasks/{id}/assigned-users
     * Listar usuarios asignados
     */
    public function assignedUsers(Task $task)
    {
        if (!$this->userHasAccess($task)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $users = $task->assignedUsers()
            ->select('users.id', 'users.name', 'users.email', 'task_user.created_at as assigned_at')
            ->get();

        return response()->json([
            'task_id' => $task->id,
            'assigned_users' => $users
        ], 200);
    }

    /**
     * GET /api/tasks/{id}/logs
     * Obtener historial de la tarea
     */
    public function logs(Task $task)
    {
        if (!$this->userHasAccess($task)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $logs = $task->logs()
            ->with('user:id,name,email')
            ->latest()
            ->get();

        return response()->json([
            'task_id' => $task->id,
            'logs' => $logs
        ], 200);
    }

    /**
     * Helper: Verificar si el usuario tiene acceso a la tarea
     */
    private function userHasAccess(Task $task)
    {
        return DB::table('group_user')
            ->join('folders', 'group_user.group_id', '=', 'folders.group_id')
            ->join('boards', 'folders.id', '=', 'boards.folder_id')
            ->join('columns', 'boards.id', '=', 'columns.board_id')
            ->where('columns.id', $task->column_id)
            ->where('group_user.user_id', auth()->id())
            ->exists();
    }

    /**
     * Helper: Verificar si el usuario tiene acceso a la columna
     */
    private function userHasAccessToColumn(Column $column)
    {
        return DB::table('group_user')
            ->join('folders', 'group_user.group_id', '=', 'folders.group_id')
            ->join('boards', 'folders.id', '=', 'boards.folder_id')
            ->join('columns', 'boards.id', '=', 'columns.board_id')
            ->where('columns.id', $column->id)
            ->where('group_user.user_id', auth()->id())
            ->exists();
    }
}
