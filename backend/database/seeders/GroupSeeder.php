<?php

namespace Database\Seeders;

use App\Models\Group;
use Illuminate\Database\Seeder;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Group::create([
            'name' => 'Desarrollo Web',
            'description' => 'Proyectos relacionados con desarrollo web',
        ]);

        Group::create([
            'name' => 'Marketing Digital',
            'description' => 'Campañas y estrategias de marketing',
        ]);

        Group::create([
            'name' => 'Diseño UI/UX',
            'description' => 'Diseño de interfaces y experiencia de usuario',
        ]);

        Group::create([
            'name' => 'Gestión de Proyectos',
            'description' => 'Administración y coordinación de proyectos',
        ]);
    }
}
