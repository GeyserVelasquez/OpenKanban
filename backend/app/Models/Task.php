<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $table = 'tasks';

    protected $fillable = [
        'name',
        'description',
        'color',
        'column_id',
        'state_id',
        'creator_id',
        'position',
    ];

    protected $casts = [
        'position' => 'float',
    ];

    public function column()
    {
        return $this->belongsTo(BoardColumn::class, 'column_id');
    }

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'task_id');
    }

    public function logs()
    {
        return $this->hasMany(Log::class, 'task_id');
    }
}
