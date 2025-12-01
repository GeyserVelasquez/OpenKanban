<?php

namespace App\Http\Controllers;

use App\Models\Log;
use Illuminate\Http\Request;

class LogController extends Controller
{
    public function index()
    {
        return Log::with(['user', 'task'])->get();
    }

    public function store(Request $request)
    {
        $log = Log::create($request->all());
        return response()->json($log, 201);
    }

    public function show($id)
    {
        return Log::with(['user', 'task'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $log = Log::findOrFail($id);
        $log->update($request->all());
        return $log;
    }

    public function destroy($id)
    {
        Log::destroy($id);
        return response()->json(['message' => 'Deleted'], 200);
    }
}
