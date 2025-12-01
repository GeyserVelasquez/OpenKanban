<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\Folder;
use Illuminate\Database\Seeder;

class BoardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $folders = Folder::all();

        if ($folders->count() > 0) {
            // Boards para el primer folder
            Board::create([
                'name' => 'Sprint 1',
                'color' => '#3B82F6',
                'folder_id' => $folders[0]->id,
            ]);

            Board::create([
                'name' => 'Sprint 2',
                'color' => '#10B981',
                'folder_id' => $folders[0]->id,
            ]);

            // Boards para el segundo folder
            if ($folders->count() > 1) {
                Board::create([
                    'name' => 'API Development',
                    'color' => '#8B5CF6',
                    'folder_id' => $folders[1]->id,
                ]);

                Board::create([
                    'name' => 'Database',
                    'color' => '#EF4444',
                    'folder_id' => $folders[1]->id,
                ]);
            }
        }
    }
}
