<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BoardColumn extends Model
{
    use HasFactory;

    protected $table = 'columns';

    protected $fillable = [
        'name',
        'color',
        'board_id',
        'position',
    ];

    protected $casts = [
        'position' => 'float',
    ];

    public function board()
    {
        return $this->belongsTo(Board::class, 'board_id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'column_id')->orderBy('position');
    }
}
