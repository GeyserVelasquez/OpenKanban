<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuarios de ejemplo
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@openkanban.com',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name' => 'John Doe',
            'email' => 'john@openkanban.com',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@openkanban.com',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name' => 'Carlos García',
            'email' => 'carlos@openkanban.com',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name' => 'María López',
            'email' => 'maria@openkanban.com',
            'password' => Hash::make('password'),
        ]);
    }
}
