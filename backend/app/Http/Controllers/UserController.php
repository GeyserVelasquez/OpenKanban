<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return response()->json($user);
    }

    public function profile()
    {
        $user = Auth::user()->loadCount(['groups', 'tasks']);

        return response()->json($user, 200);
    }

    /**
     * GET /api/users/tasks
     * Obtener tareas asignadas al usuario con filtros opcionales
     */
    /**
     * GET /api/users/tasks
     * Obtener tareas asignadas al usuario con filtros opcionales
     */
    public function tasks(Request $request)
    {
        $query = Auth::user()->tasks()
            ->with([
                'column.board.folder.group',
                'state:id,name,color',
                'creator:id,name,email'
            ]);

        // Filtro por estado
        if ($request->has('state_id')) {
            $query->where('state_id', $request->state_id);
        }

        // Filtro por grupo
        if ($request->has('group_id')) {
            $query->whereHas('column.board.folder', function ($q) use ($request) {
                $q->where('group_id', $request->group_id);
            });
        }

        $tasks = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'tasks' => $tasks
        ], 200);
    }

    public function getPreferences()
    {
        // Retornar preferencias por defecto o guardadas si existieran
        return response()->json([
            'theme' => 'system', // O lo que el usuario tenga guardado
            'language' => 'es'
        ]);
    }

    public function updatePreferences(Request $request)
    {
        // Validar y guardar preferencias
        // Por ahora solo devolvemos éxito para evitar errores en frontend
        return response()->json([
            'message' => 'Preferencias actualizadas',
            'preferences' => $request->all()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, user $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(user $user)
    {
        //
    }
}
