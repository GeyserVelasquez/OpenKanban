<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ejecutar seeders en orden debido a dependencias
        $this->call([
            // 1. Seeders sin dependencias
            UserSeeder::class,
            StateSeeder::class,
            GroupSeeder::class,
            
            // 2. Folders dependen de Groups
            FolderSeeder::class,
            
            // 3. Boards dependen de Folders
            BoardSeeder::class,
            
            // 4. Columns dependen de Boards
            ColumnSeeder::class,
            
            // 5. Tasks dependen de Columns, States y Users
            TaskSeeder::class,
            
            // 6. TaskUser depende de Tasks y Users
            TaskUserSeeder::class,
            
            // 7. Comments dependen de Tasks y Users
            CommentSeeder::class,
            
            // 8. Logs dependen de Tasks y Users
            LogSeeder::class,
        ]);
    }
}
