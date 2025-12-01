<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'name' => 'admin',
            'email' => 'admin@example.com',
            // Usar Hash::make para encriptar la contraseña (¡es crucial!)
            'password' => Hash::make('password'), 
            // Si tu migración de Breeze API incluye campos como 'email_verified_at',
            // puedes añadirlos aquí para que el usuario esté verificado.
            'email_verified_at' => now(), 
        ]);
    }
}
