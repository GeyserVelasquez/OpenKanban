<?php

namespace App\Http\Controllers;

use App\Models\Log;
use Illuminate\Http\Request;

class LogController extends Controller
{
    public function index()
    {
        $logs = Log::with(['user', 'task'])->get();
        return response()->json($logs, 200);
    }

    public function store(Request $request)
    {
        $log = Log::create($request->all());
        return response()->json($log, 201);
    }

    public function show(Log $log)
    {
        $log->load(['user', 'task']);
        return response()->json($log, 200);
    }

    public function update(Request $request, Log $log)
    {
        $log->update($request->all());
        return response()->json($log, 200);
    }

    public function destroy(Log $log)
    {
        $log->delete();
        return response()->noContent();
    }
}
