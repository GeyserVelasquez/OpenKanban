<?php

namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function index()
    {
        return Board::all();
    }

    public function store(Request $request)
    {
        $board = Board::create($request->all());
        return response()->json($board, 201);
    }

    public function show($id)
    {
        return Board::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $board = Board::findOrFail($id);
        $board->update($request->all());
        return $board;
    }

    public function destroy($id)
    {
        Board::destroy($id);
        return response()->json(['message' => 'Deleted'], 200);
    }
}
