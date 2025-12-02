<?php

namespace App\Http\Controllers;

use App\Models\Column;
use App\Models\Board;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ColumnController extends Controller
{
    /**
     * POST /api/columns
     * Crear columna
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:255',
            'board_id' => 'required|exists:boards,id',
            'position' => 'required|numeric',
        ]);

        // Verificar acceso al board
        $board = Board::findOrFail($request->board_id);
        if (!$this->userHasAccessToBoard($board)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $column = Column::create([
            'name' => $request->name,
            'color' => $request->color ?? '#64748B',
            'board_id' => $request->board_id,
            'position' => $request->position,
        ]);

        return response()->json($column, 201);
    }

    /**
     * PUT /api/columns/{id}
     * Actualizar columna
     */
    public function update(Request $request, Column $column)
    {
        if (!$this->userHasAccess($column)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'color' => 'nullable|string|max:255',
            'position' => 'sometimes|numeric',
        ]);

        $column->update($request->only(['name', 'color', 'position']));

        return response()->json($column, 200);
    }

    /**
     * DELETE /api/columns/{id}
     * Eliminar columna (elimina tareas en cascada)
     */
    public function destroy(Column $column)
    {
        if (!$this->userHasAccess($column)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $column->delete();

        return response()->noContent();
    }

    /**
     * PUT /api/columns/{id}/reorder
     * Reordenar columna
     */
    public function reorder(Request $request, Column $column)
    {
        if (!$this->userHasAccess($column)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'position' => 'required|numeric',
        ]);

        $column->update(['position' => $request->position]);

        return response()->json([
            'id' => $column->id,
            'position' => $column->position,
            'message' => 'Columna reordenada'
        ], 200);
    }

    /**
     * POST /api/columns/batch-reorder
     * Reordenar múltiples columnas
     */
    public function batchReorder(Request $request)
    {
        $request->validate([
            'columns' => 'required|array',
            'columns.*.id' => 'required|exists:columns,id',
            'columns.*.position' => 'required|numeric',
        ]);

        DB::beginTransaction();
        try {
            $updated = 0;
            foreach ($request->columns as $columnData) {
                $column = Column::find($columnData['id']);

                if (!$this->userHasAccess($column)) {
                    continue;
                }

                $column->update(['position' => $columnData['position']]);
                $updated++;
            }

            DB::commit();
            return response()->json([
                'message' => 'Columnas reordenadas',
                'updated' => $updated
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al reordenar columnas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper: Verificar acceso a columna
     */
    private function userHasAccess(Column $column)
    {
        return DB::table('group_user')
            ->join('folders', 'group_user.group_id', '=', 'folders.group_id')
            ->join('boards', 'folders.id', '=', 'boards.folder_id')
            ->where('boards.id', $column->board_id)
            ->where('group_user.user_id', auth()->id())
            ->exists();
    }

    /**
     * Helper: Verificar acceso a board
     */
    private function userHasAccessToBoard(Board $board)
    {
        return DB::table('group_user')
            ->join('folders', 'group_user.group_id', '=', 'folders.group_id')
            ->where('folders.id', $board->folder_id)
            ->where('group_user.user_id', auth()->id())
            ->exists();
    }
}
