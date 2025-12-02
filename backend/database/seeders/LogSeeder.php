<?php

namespace Database\Seeders;

use App\Models\Log;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class LogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tasks = Task::all();
        $users = User::all();

        if ($tasks->count() > 0 && $users->count() > 0) {
            $logMessages = [
                'Tarea creada',
                'Estado cambiado a En Progreso',
                'Descripción actualizada',
                'Usuario asignado',
                'Prioridad modificada',
                'Comentario agregado',
                'Archivo adjuntado',
                'Fecha límite actualizada',
                'Tarea movida a otra columna',
                'Estado cambiado a Completado',
            ];

            foreach ($tasks as $task) {
                // Crear entre 2 y 5 logs por tarea
                $numLogs = rand(2, 5);
                
                for ($i = 0; $i < $numLogs; $i++) {
                    Log::create([
                        'user_id' => $users->random()->id,
                        'task_id' => $task->id,
                        'message' => $logMessages[array_rand($logMessages)],
                    ]);
                }
            }
        }
    }
}
