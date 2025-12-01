<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function index()
    {
        $groups = Group::with('folder')->get();
        return response()->json($groups, 200);
    }

    public function store(Request $request)
    {
        $group = Group::create($request->all());
        return response()->json($group, 201);
    }

    public function show(Group $group)
    {
        return response()->json($group, 200);
    }

    public function update(Request $request, Group $group)
    {
        $group->update($request->all());
        return response()->json($group, 200);
    }

    // En tu archivo de rutas (api.php) asegúrate de usar {group}
    // Route::delete('/groups/{group}', [GroupController::class, 'destroy']);

    public function destroy(Group $group) // Inyectas el modelo
    {
        $group->delete();
        return response()->noContent(); 
    }
}
