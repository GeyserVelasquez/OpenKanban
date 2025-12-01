<?php

namespace Database\Seeders;

use App\Models\State;
use Illuminate\Database\Seeder;

class StateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $states = [
            ['name' => 'Pendiente', 'color' => '#FFA500'],
            ['name' => 'En Progreso', 'color' => '#3B82F6'],
            ['name' => 'En Revisión', 'color' => '#FBBF24'],
            ['name' => 'Completado', 'color' => '#10B981'],
            ['name' => 'Bloqueado', 'color' => '#EF4444'],
        ];

        foreach ($states as $state) {
            State::create($state);
        }
    }
}
