<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\Column;
use App\Models\State;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $columns = Column::all();
        $states = State::all();
        $users = User::all();

        if ($columns->count() > 0 && $states->count() > 0 && $users->count() > 0) {
            $taskData = [
                [
                    'name' => 'Diseñar página de inicio',
                    'description' => 'Crear mockups y diseño de la página principal',
                    'color' => '#3B82F6',
                ],
                [
                    'name' => 'Implementar autenticación',
                    'description' => 'Desarrollar sistema de login y registro de usuarios',
                    'color' => '#10B981',
                ],
                [
                    'name' => 'Configurar base de datos',
                    'description' => 'Crear migraciones y seeders para la BD',
                    'color' => '#8B5CF6',
                ],
                [
                    'name' => 'Crear API REST',
                    'description' => 'Desarrollar endpoints para el frontend',
                    'color' => '#EF4444',
                ],
                [
                    'name' => 'Testing unitario',
                    'description' => 'Escribir tests para los componentes principales',
                    'color' => '#F59E0B',
                ],
                [
                    'name' => 'Documentación',
                    'description' => 'Crear documentación técnica del proyecto',
                    'color' => '#06B6D4',
                ],
                [
                    'name' => 'Optimización de rendimiento',
                    'description' => 'Mejorar tiempos de carga y respuesta',
                    'color' => '#EC4899',
                ],
                [
                    'name' => 'Deploy a producción',
                    'description' => 'Configurar servidor y desplegar aplicación',
                    'color' => '#14B8A6',
                ],
            ];

            $position = 1;
            foreach ($taskData as $data) {
                Task::create([
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'color' => $data['color'],
                    'column_id' => $columns->random()->id,
                    'state_id' => $states->random()->id,
                    'creator_id' => $users->random()->id,
                    'position' => $position++,
                ]);
            }
        }
    }
}
