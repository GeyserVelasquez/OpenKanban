<?php

namespace App\Http\Controllers;

use App\Models\BoardColumn;
use Illuminate\Http\Request;

class ColumnController extends Controller
{
    public function index()
    {
        return BoardColumn::all();
    }

    public function store(Request $request)
    {
        $column = BoardColumn::create($request->all());
        return response()->json($column, 201);
    }

    public function show($id)
    {
        return BoardColumn::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $column = BoardColumn::findOrFail($id);
        $column->update($request->all());
        return $column;
    }

    public function destroy($id)
    {
        BoardColumn::destroy($id);
        return response()->json(['message' => 'Deleted'], 200);
    }
}
