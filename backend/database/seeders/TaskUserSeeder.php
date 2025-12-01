<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tasks = Task::all();
        $users = User::all();

        if ($tasks->count() > 0 && $users->count() > 0) {
            foreach ($tasks as $task) {
                // Asignar entre 1 y 3 usuarios aleatorios a cada tarea
                $randomUsers = $users->random(rand(1, min(3, $users->count())));
                
                foreach ($randomUsers as $user) {
                    $task->users()->attach($user->id);
                }
            }
        }
    }
}
