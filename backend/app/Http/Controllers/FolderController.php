<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use Illuminate\Http\Request;

class FolderController extends Controller
{
    public function index()
    {
        return Folder::all();
    }

    public function store(Request $request)
    {
        $folder = Folder::create($request->all());
        return response()->json($folder, 201);
    }

    public function show($id)
    {
        return Folder::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $folder = Folder::findOrFail($id);
        $folder->update($request->all());
        return $folder;
    }

    public function destroy($id)
    {
        Folder::destroy($id);
        return response()->json(['message' => 'Deleted'], 200);
    }
}
