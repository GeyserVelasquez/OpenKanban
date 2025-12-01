<?php

namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function index()
    {
        $boards = Board::all();
        return response()->json($boards, 200);
    }

    public function store(Request $request)
    {
        $board = Board::create($request->all());
        return response()->json($board, 201);
    }

    public function show(Board $board)
    {
        return response()->json($board, 200);
    }

    public function update(Request $request, Board $board)
    {
        $board->update($request->all());
        return response()->json($board, 200);
    }

    public function destroy(Board $board)
    {
        $board->delete();
        return response()->noContent();
    }
}
