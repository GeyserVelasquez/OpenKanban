<?php

namespace Database\Seeders;

use App\Models\Folder;
use App\Models\Group;
use Illuminate\Database\Seeder;

class FolderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $groups = Group::all();

        if ($groups->count() > 0) {
            // Folders para el primer grupo
            Folder::create([
                'name' => 'Frontend',
                'color' => '#60A5FA',
                'group_id' => $groups[0]->id,
            ]);

            Folder::create([
                'name' => 'Backend',
                'color' => '#34D399',
                'group_id' => $groups[0]->id,
            ]);

            // Folders para el segundo grupo
            if ($groups->count() > 1) {
                Folder::create([
                    'name' => 'Redes Sociales',
                    'color' => '#F472B6',
                    'group_id' => $groups[1]->id,
                ]);

                Folder::create([
                    'name' => 'Email Marketing',
                    'color' => '#FBBF24',
                    'group_id' => $groups[1]->id,
                ]);
            }

            // Folders para el tercer grupo
            if ($groups->count() > 2) {
                Folder::create([
                    'name' => 'Wireframes',
                    'color' => '#A78BFA',
                    'group_id' => $groups[2]->id,
                ]);

                Folder::create([
                    'name' => 'Prototipos',
                    'color' => '#FB923C',
                    'group_id' => $groups[2]->id,
                ]);
            }
        }
    }
}
