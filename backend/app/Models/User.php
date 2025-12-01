<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    // Tareas creadas por el usuario
    public function createdTasks()
    {
        return $this->hasMany(Task::class, 'creator_id');
    }

    // Relación Many-to-Many con tareas asignadas
    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'task_user', 'user_id', 'task_id')
            ->using(TaskUser::class)
            ->withTimestamps();
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'author_id');
    }

    public function logs()
    {
        return $this->hasMany(Log::class, 'user_id');
    }
}
