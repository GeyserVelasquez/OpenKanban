<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FolderController extends Controller
{
    /**
     * GET /api/folders
     * Listar folders del usuario (a través de grupos)
     */
    public function index()
    {
        $folders = Folder::select('folders.*', 'groups.name as group_name')
            ->join('groups', 'folders.group_id', '=', 'groups.id')
            ->join('group_user', 'groups.id', '=', 'group_user.group_id')
            ->where('group_user.user_id', auth()->id())
            ->withCount('boards')
            ->get();

        return response()->json($folders, 200);
    }

    /**
     * POST /api/folders
     * Crear folder
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:20',
            'group_id' => 'required|exists:groups,id',
        ]);

        // Verificar que el usuario pertenece al grupo
        $group = Group::findOrFail($request->group_id);
        if (!$group->users->contains(auth ()->id())) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $folder = Folder::create([
            'name' => $request->name,
            'color' => $request->color,
            'group_id' => $request->group_id,
        ]);

        return response()->json($folder, 201);
    }

    /**
     * GET /api/folders/{id}
     * Obtener folder con sus boards (sin tareas)
     */
    public function show(Folder $folder)
    {
        if (!$this->userHasAccess($folder)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $folder->load(['boards' => function($query) {
            $query->withCount(['columns', 'columns as tasks_count' => function($q) {
                $q->join('tasks', 'columns.id', '=', 'tasks.column_id');
            }]);
        }]);

        return response()->json($folder, 200);
    }

    /**
     * PUT /api/folders/{id}
     * Actualizar folder
     */
    public function update(Request $request, Folder $folder)
    {
        if (!$this->userHasAccess($folder)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'color' => 'nullable|string|max:20',
        ]);

        $folder->update($request->only(['name', 'color']));

        return response()->json($folder, 200);
    }

    /**
     * DELETE /api/folders/{id}
     * Eliminar folder (elimina boards en cascada)
     */
    public function destroy(Folder $folder)
    {
        if (!$this->userHasAccess($folder)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // No permitir eliminar folder "root"
        if ($folder->name === 'root') {
            return response()->json([
                'message' => 'No se puede eliminar la carpeta raíz'
            ], 400);
        }

        $folder->delete();

        return response()->noContent();
    }

    /**
     * Helper: Verificar acceso
     */
    private function userHasAccess(Folder $folder)
    {
        return DB::table('group_user')
            ->where('group_id', $folder->group_id)
            ->where('user_id', auth()->id())
            ->exists();
    }
}
