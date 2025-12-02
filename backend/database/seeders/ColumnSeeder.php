<?php

namespace Database\Seeders;

use App\Models\Column;
use App\Models\Board;
use Illuminate\Database\Seeder;

class ColumnSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $boards = Board::all();

        foreach ($boards as $board) {
            // Columnas estándar de Kanban
            Column::create([
                'name' => 'Por Hacer',
                'color' => '#94A3B8',
                'board_id' => $board->id,
                'position' => 1,
            ]);

            Column::create([
                'name' => 'En Progreso',
                'color' => '#3B82F6',
                'board_id' => $board->id,
                'position' => 2,
            ]);

            Column::create([
                'name' => 'En Revisión',
                'color' => '#FBBF24',
                'board_id' => $board->id,
                'position' => 3,
            ]);

            Column::create([
                'name' => 'Completado',
                'color' => '#10B981',
                'board_id' => $board->id,
                'position' => 4,
            ]);
        }
    }
}
