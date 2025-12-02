<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Seeder;

class GroupUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $groups = Group::all();
        $users = User::all();

        if ($groups->count() > 0 && $users->count() > 0) {
            foreach ($groups as $group) {
                // Asignar entre 2 y 4 usuarios aleatorios a cada grupo
                $randomUsers = $users->random(rand(2, min(4, $users->count())));
                
                foreach ($randomUsers as $user) {
                    $group->users()->attach($user->id);
                }
            }
        }
    }
}
