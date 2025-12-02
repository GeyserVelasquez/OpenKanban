<?php

namespace App\Http\Controllers;

use App\Models\State;
use Illuminate\Http\Request;

class StateController extends Controller
{
    /**
     * GET /api/states
     * Listar todos los estados
     */
    public function index()
    {
        $states = State::all();
        return response()->json($states, 200);
    }

    /**
     * POST /api/states
     * Crear estado
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:states',
            'color' => 'nullable|string|max:20',
        ]);

        $state = State::create([
            'name' => $request->name,
            'color' => $request->color ?? '#3B82F6',
        ]);

        return response()->json($state, 201);
    }

    /**
     * PUT /api/states/{id}
     * Actualizar estado
     */
    public function update(Request $request, State $state)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:states,name,' . $state->id,
            'color' => 'nullable|string|max:20',
        ]);

        $state->update($request->only(['name', 'color']));

        return response()->json($state, 200);
    }

    /**
     * DELETE /api/states/{id}
     * Eliminar estado
     */
    public function destroy(State $state)
    {
        // Verificar si hay tareas usando este estado
        if ($state->tasks()->count() > 0) {
            return response()->json([
                'message' => 'No se puede eliminar un estado que está en uso'
            ], 400);
        }

        $state->delete();

        return response()->noContent();
    }
}
