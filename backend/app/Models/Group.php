<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $table = 'groups';

    protected $fillable = [
        'name',
        'description',
    ];

    // Relaciones
    public function folders()
    {
        return $this->hasMany(Folder::class, 'group_id');
    }
}
