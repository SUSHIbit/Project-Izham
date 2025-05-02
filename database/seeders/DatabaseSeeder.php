<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Enemy;
use App\Models\PlayerProfile;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'mimin@gmail.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('123456789'),
                'is_admin' => true,
                'max_level_reached' => 0,
            ]
        );

        // Create player profile for admin (optional)
        if (!$admin->playerProfile) {
            PlayerProfile::create([
                'user_id' => $admin->id,
                'name' => null,
                'current_level' => 1,
                'max_hp' => 100,
                'attack_min' => 10,
                'attack_max' => 15,
                'defense' => 5,
                'heal' => 30,
            ]);
        }

        // Create regular player
        $player = User::firstOrCreate(
            ['email' => 'player@gmail.com'],
            [
                'name' => 'Test Player',
                'password' => Hash::make('123456789'),
                'is_admin' => false,
                'max_level_reached' => 5,
            ]
        );

        // Create player profile
        if (!$player->playerProfile) {
            PlayerProfile::create([
                'user_id' => $player->id,
                'name' => 'Hero',
                'current_level' => 5,
                'max_hp' => 120,
                'attack_min' => 12,
                'attack_max' => 18,
                'defense' => 8,
                'heal' => 35,
            ]);
        }

        // Create enemies for different level groups
        $enemies = [
            // Level 1-10 (Group 1)
            [
                'name' => 'Goblin Scout',
                'hp' => 50,
                'attack_min' => 5,
                'attack_max' => 10,
                'defense' => 3,
                'level_group' => 1,
                'image_path' => null,
            ],
            [
                'name' => 'Cave Rat',
                'hp' => 40,
                'attack_min' => 4,
                'attack_max' => 8,
                'defense' => 2,
                'level_group' => 1,
                'image_path' => null,
            ],
            [
                'name' => 'Skeleton Warrior',
                'hp' => 60,
                'attack_min' => 6,
                'attack_max' => 12,
                'defense' => 4,
                'level_group' => 1,
                'image_path' => null,
            ],
            
            // Level 11-20 (Group 2)
            [
                'name' => 'Orc Fighter',
                'hp' => 80,
                'attack_min' => 8,
                'attack_max' => 16,
                'defense' => 6,
                'level_group' => 2,
                'image_path' => null,
            ],
            [
                'name' => 'Dark Elf Scout',
                'hp' => 70,
                'attack_min' => 10,
                'attack_max' => 18,
                'defense' => 5,
                'level_group' => 2,
                'image_path' => null,
            ],
            [
                'name' => 'Cave Troll',
                'hp' => 100,
                'attack_min' => 12,
                'attack_max' => 20,
                'defense' => 8,
                'level_group' => 2,
                'image_path' => null,
            ],
            
            // Level 21-30 (Group 3)
            [
                'name' => 'Vampire Spawn',
                'hp' => 120,
                'attack_min' => 15,
                'attack_max' => 25,
                'defense' => 10,
                'level_group' => 3,
                'image_path' => null,
            ],
            [
                'name' => 'Minotaur',
                'hp' => 150,
                'attack_min' => 18,
                'attack_max' => 30,
                'defense' => 12,
                'level_group' => 3,
                'image_path' => null,
            ],

            // Level 31-50 (Group 4)
            [
                'name' => 'Elemental Guardian',
                'hp' => 180,
                'attack_min' => 22,
                'attack_max' => 35,
                'defense' => 15,
                'level_group' => 4,
                'image_path' => null,
            ],
            [
                'name' => 'Ancient Golem',
                'hp' => 200,
                'attack_min' => 25,
                'attack_max' => 40,
                'defense' => 18,
                'level_group' => 4,
                'image_path' => null,
            ],

            // Level 51-75 (Group 5)
            [
                'name' => 'Dark Knight',
                'hp' => 250,
                'attack_min' => 30,
                'attack_max' => 45,
                'defense' => 22,
                'level_group' => 5,
                'image_path' => null,
            ],
            [
                'name' => 'Demon Archer',
                'hp' => 230,
                'attack_min' => 35,
                'attack_max' => 50,
                'defense' => 20,
                'level_group' => 5,
                'image_path' => null,
            ],

            // Level 76-99 (Group 6)
            [
                'name' => 'Ancient Dragon',
                'hp' => 350,
                'attack_min' => 40,
                'attack_max' => 60,
                'defense' => 30,
                'level_group' => 6,
                'image_path' => null,
            ],
            [
                'name' => 'Shadow Lich',
                'hp' => 300,
                'attack_min' => 45,
                'attack_max' => 65,
                'defense' => 25,
                'level_group' => 6,
                'image_path' => null,
            ],

            // Level 100 (Group 7 - Final Boss)
            [
                'name' => 'The Dungeon Master',
                'hp' => 500,
                'attack_min' => 50,
                'attack_max' => 80,
                'defense' => 40,
                'level_group' => 7,
                'image_path' => null,
            ],
        ];

        foreach ($enemies as $enemyData) {
            Enemy::firstOrCreate(
                [
                    'name' => $enemyData['name'],
                    'level_group' => $enemyData['level_group'],
                ],
                $enemyData
            );
        }
    }
}