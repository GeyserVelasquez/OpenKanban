<?php

namespace App\Http\Controllers;

use App\Models\State;
use Illuminate\Http\Request;

class StateController extends Controller
{
    public function index()
    {
        $states = State::all();
        return response()->json($states, 200);
    }

    public function store(Request $request)
    {
        $state = State::create($request->all());
        return response()->json($state, 201);
    }

    public function show(State $state)
    {
        return response()->json($state, 200);
    }

    public function update(Request $request, State $state)
    {
        $state->update($request->all());
        return response()->json($state, 200);
    }

    public function destroy(State $state)
    {
        $state->delete();
        return response()->noContent();
    }
}
