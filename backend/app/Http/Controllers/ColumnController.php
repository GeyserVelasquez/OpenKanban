<?php

namespace App\Http\Controllers;

use App\Models\Column;
use Illuminate\Http\Request;

class ColumnController extends Controller
{
    public function index()
    {
        $columns = Column::all();
        return response()->json($columns, 200);
    }

    public function store(Request $request)
    {
        $column = Column::create($request->all());
        return response()->json($column, 201);
    }

    public function show(Column $column)
    {
        return response()->json($column, 200);
    }

    public function update(Request $request, Column $column)
    {
        $column->update($request->all());
        return response()->json($column, 200);
    }

    public function destroy(Column $column)
    {
        $column->delete();
        return response()->noContent();
    }
}
