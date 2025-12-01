<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use Illuminate\Http\Request;

class FolderController extends Controller
{
    public function index()
    {
        $folders = Folder::all();
        return response()->json($folders, 200);
    }

    public function store(Request $request)
    {
        $folder = Folder::create($request->all());
        return response()->json($folder, 201);
    }

    public function show(Folder $folder)
    {
        return response()->json($folder, 200);
    }

    public function update(Request $request, Folder $folder)
    {
        $folder->update($request->all());
        return response()->json($folder, 200);
    }

    public function destroy(Folder $folder)
    {
        $folder->delete();
        return response()->noContent();
    }
}
