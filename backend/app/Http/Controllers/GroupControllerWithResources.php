<?php

namespace App\Http\Controllers;

use App\Http\Resources\GroupCollection;
use App\Http\Resources\GroupResource;
use App\Models\Group;
use Illuminate\Http\Request;

/**
 * Ejemplo de GroupController usando API Resources
 * Compara este con GroupController.php para ver las diferencias
 */
class GroupControllerWithResources extends Controller
{
    public function index()
    {
        $groups = Group::all();
        
        // Opción 1: Usar collection automático
        return GroupResource::collection($groups);
        
        // Opción 2: Usar custom collection
        // return new GroupCollection($groups);
    }

    public function store(Request $request)
    {
        $group = Group::create($request->all());
        
        // Automáticamente formatea la respuesta
        return (new GroupResource($group))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Group $group)
    {
        // Simple y limpio
        return new GroupResource($group);
    }

    public function update(Request $request, Group $group)
    {
        $group->update($request->all());
        
        // Retorna el recurso formateado
        return new GroupResource($group);
    }

    public function destroy(Group $group)
    {
        $group->delete();
        return response()->noContent();
    }
}
