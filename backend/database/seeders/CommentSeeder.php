<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tasks = Task::all();
        $users = User::all();

        if ($tasks->count() > 0 && $users->count() > 0) {
            foreach ($tasks->take(5) as $task) {
                // Crear comentario principal
                $parentComment = Comment::create([
                    'content' => 'Este es un comentario de prueba para la tarea.',
                    'task_id' => $task->id,
                    'author_id' => $users->random()->id,
                    'parent_comment_id' => null,
                ]);

                // Crear respuesta al comentario
                Comment::create([
                    'content' => 'Respuesta al comentario anterior.',
                    'task_id' => $task->id,
                    'author_id' => $users->random()->id,
                    'parent_comment_id' => $parentComment->id,
                ]);

                // Crear otro comentario independiente
                Comment::create([
                    'content' => 'Otro comentario diferente sobre esta tarea.',
                    'task_id' => $task->id,
                    'author_id' => $users->random()->id,
                    'parent_comment_id' => null,
                ]);
            }
        }
    }
}
