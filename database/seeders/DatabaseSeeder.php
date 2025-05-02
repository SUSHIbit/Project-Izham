<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Enemy;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::firstOrCreate(
            ['email' => 'mimin@gmail.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('123456789'),
                'is_admin' => true,
            ]
        );

        // Create regular player
        User::firstOrCreate(
            ['email' => 'player@gmail.com'],
            [
                'name' => 'Player 1',
                'password' => Hash::make('123456789'),
                'is_admin' => false,
            ]
        );

        // Create some enemies
        $enemies = [
            [
                'name' => 'Goblin',
                'hp' => 50,
                'attack' => 8,
                'defense' => 3,
                'image_path' => null, // You would need to add actual images
            ],
            [
                'name' => 'Orc',
                'hp' => 80,
                'attack' => 12,
                'defense' => 5,
                'image_path' => null,
            ],
            [
                'name' => 'Dragon',
                'hp' => 200,
                'attack' => 25,
                'defense' => 15,
                'image_path' => null,
            ],
            [
                'name' => 'Skeleton',
                'hp' => 40,
                'attack' => 10,
                'defense' => 2,
                'image_path' => null,
            ],
            [
                'name' => 'Dark Knight',
                'hp' => 120,
                'attack' => 18,
                'defense' => 10,
                'image_path' => null,
            ],
        ];

        foreach ($enemies as $enemy) {
            Enemy::firstOrCreate(
                ['name' => $enemy['name']],
                $enemy
            );
        }
    }
}