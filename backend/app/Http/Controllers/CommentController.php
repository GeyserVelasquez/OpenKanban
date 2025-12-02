<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{
    /**
     * GET /api/tasks/{taskId}/comments
     * Obtener comentarios de una tarea con hilos anidados
     */
    public function index($taskId)
    {
        $task = Task::findOrFail($taskId);

        // Verificar acceso
        if (!$this->userHasAccessToTask($task)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // Obtener comentarios raíz con sus respuestas anidadas
        $comments = Comment::with(['author:id,name,email'])
            ->where('task_id', $taskId)
            ->whereNull('parent_comment_id') // Solo raíz
            ->latest()
            ->get();

        // Cargar respuestas recursivamente
        $comments->each(function ($comment) {
            $this->loadReplies($comment);
        });

        return response()->json([
            'task_id' => $taskId,
            'comments' => $comments
        ], 200);
    }

    /**
     * POST /api/comments
     * Crear comentario (raíz o respuesta)
     */
    public function store(Request $request)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'text' => 'required|string',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $task = Task::findOrFail($request->task_id);

        if (!$this->userHasAccessToTask($task)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $comment = Comment::create([
            'content' => $request->text,
            'task_id' => $request->task_id,
            'parent_comment_id' => $request->parent_id,
            'author_id' => auth()->id(),
        ]);

        $comment->load('author:id,name,email');

        return response()->json($comment, 201);
    }

    /**
     * PUT /api/comments/{id}
     * Actualizar comentario
     */
    public function update(Request $request, Comment $comment)
    {
        // Solo el autor puede editar
        if ($comment->author_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'text' => 'required|string',
        ]);

        $comment->update(['content' => $request->text]);

        return response()->json($comment, 200);
    }

    /**
     * DELETE /api/comments/{id}
     * Eliminar comentario (elimina respuestas en cascada)
     */
    public function destroy(Comment $comment)
    {
        // Solo el autor puede eliminar
        if ($comment->author_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $comment->delete();

        return response()->noContent();
    }

    /**
     * Helper: Cargar respuestas recursivamente
     */
    private function loadReplies($comment)
    {
        $comment->load(['replies' => function($query) {
            $query->with('author:id,name,email')->latest();
        }]);

        $comment->replies->each(function ($reply) {
            $this->loadReplies($reply);
        });
    }

    /**
     * Helper: Verificar acceso a tarea
     */
    private function userHasAccessToTask(Task $task)
    {
        return DB::table('group_user')
            ->join('folders', 'group_user.group_id', '=', 'folders.group_id')
            ->join('boards', 'folders.id', '=', 'boards.folder_id')
            ->join('columns', 'boards.id', '=', 'columns.board_id')
            ->where('columns.id', $task->column_id)
            ->where('group_user.user_id', auth()->id())
            ->exists();
    }
}
