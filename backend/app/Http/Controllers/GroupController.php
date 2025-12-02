<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GroupController extends Controller
{
    /**
     * GET /api/groups
     * Contexto: Sidebar inicial
     * Obtener grupos del usuario con folders y boards (SIN tareas)
     */
    public function index()
    {
        $user = auth()->user();

        $groups = $user->groups()
            ->with(['folders.boards'])
            ->get();

        return response()->json($groups, 200);
    }

    /**
     * POST /api/groups
     * Crear grupo (crea folder "root" automáticamente)
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            // Crear grupo
            $group = Group::create([
                'name' => $request->name,
                'description' => $request->description,
            ]);

            // Asignar el usuario actual al grupo
            $group->users()->attach(auth()->id());

            // Crear folder "root" automático
            $group->folders()->create([
                'name' => 'root',
                'color' => null,
            ]);

            // Recargar con folders
            $group->load('folders');

            DB::commit();
            return response()->json($group, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al crear el grupo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/groups/{id}
     * Obtener un grupo específico con folders y boards
     */
    public function show(Group $group)
    {
        // Verificar que el usuario pertenece al grupo
        if (!$group->users->contains(auth()->id())) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $group->load(['folders.boards']);
        $group->members_count = $group->users()->count();

        return response()->json($group, 200);
    }

    /**
     * PUT /api/groups/{id}
     * Actualizar grupo
     */
    public function update(Request $request, Group $group)
    {
        // Verificar que el usuario pertenece al grupo
        if (!$group->users->contains(auth()->id())) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $group->update($request->only(['name', 'description']));

        return response()->json($group, 200);
    }

    /**
     * DELETE /api/groups/{id}
     * Eliminar grupo (elimina en cascada folders, boards, etc.)
     */
    public function destroy(Group $group)
    {
        // Verificar que el usuario pertenece al grupo
        if (!$group->users->contains(auth()->id())) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $group->delete();

        return response()->noContent();
    }

    /**
     * POST /api/groups/{id}/members
     * Agregar miembro al grupo
     */
    public function addMember(Request $request, Group $group)
    {
        // Verificar que el usuario pertenece al grupo
        if (!$group->users->contains(auth()->id())) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::findOrFail($request->user_id);

        // Verificar si ya está en el grupo
        if ($group->users->contains($user->id)) {
            return response()->json([
                'message' => 'El usuario ya está en el grupo'
            ], 400);
        }

        $group->users()->attach($user->id);

        return response()->json([
            'message' => 'Usuario agregado al grupo',
            'user' => $user->only(['id', 'name', 'email'])
        ], 200);
    }

    /**
     * DELETE /api/groups/{id}/members/{userId}
     * Remover miembro del grupo
     */
    public function removeMember(Group $group, $userId)
    {
        // Verificar que el usuario pertenece al grupo
        if (!$group->users->contains(auth()->id())) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $group->users()->detach($userId);

        return response()->json([
            'message' => 'Usuario removido del grupo'
        ], 200);
    }

    /**
     * GET /api/groups/{id}/members
     * Listar miembros del grupo
     */
    public function members(Group $group)
    {
        // Verificar que el usuario pertenece al grupo
        if (!$group->users->contains(auth()->id())) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $members = $group->users()
            ->select('users.id', 'users.name', 'users.email', 'group_user.created_at as joined_at')
            ->get();

        return response()->json([
            'members' => $members
        ], 200);
    }

    /**
     * GET /api/groups/{id}/stats
     * Estadísticas del grupo
     */
    public function stats(Group $group)
    {
        // Verificar que el usuario pertenece al grupo
        if (!$group->users->contains(auth()->id())) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $boardsCount = $group->folders()->withCount('boards')->get()->sum('boards_count');

        // Contar tareas a través de folders -> boards -> columns -> tasks
        $tasksCount = DB::table('tasks')
            ->join('columns', 'tasks.column_id', '=', 'columns.id')
            ->join('boards', 'columns.board_id', '=', 'boards.id')
            ->join('folders', 'boards.folder_id', '=', 'folders.id')
            ->where('folders.group_id', $group->id)
            ->count();

        $completedTasks = DB::table('tasks')
            ->join('columns', 'tasks.column_id', '=', 'columns.id')
            ->join('boards', 'columns.board_id', '=', 'boards.id')
            ->join('folders', 'boards.folder_id', '=', 'folders.id')
            ->join('states', 'tasks.state_id', '=', 'states.id')
            ->where('folders.group_id', $group->id)
            ->whereIn('states.name', ['Completada', 'Hecho', 'Done', 'Completado'])
            ->count();

        $tasksByState = DB::table('tasks')
            ->join('columns', 'tasks.column_id', '=', 'columns.id')
            ->join('boards', 'columns.board_id', '=', 'boards.id')
            ->join('folders', 'boards.folder_id', '=', 'folders.id')
            ->join('states', 'tasks.state_id', '=', 'states.id')
            ->where('folders.group_id', $group->id)
            ->select('states.name as state', DB::raw('count(*) as count'))
            ->groupBy('states.name')
            ->get();

        return response()->json([
            'group_id' => $group->id,
            'name' => $group->name,
            'members_count' => $group->users()->count(),
            'boards_count' => $boardsCount,
            'tasks_count' => $tasksCount,
            'completed_tasks' => $completedTasks,
            'pending_tasks' => $tasksCount - $completedTasks,
            'tasks_by_state' => $tasksByState,
        ], 200);
    }


}
