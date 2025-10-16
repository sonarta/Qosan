<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin Qosan',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => 'admin',
                'status' => 'active',
            ]
        );

        // Create Owner Users
        $owners = [
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@owner.com',
                'role' => 'owner',
                'status' => 'active',
            ],
            [
                'name' => 'Siti Nurhaliza',
                'email' => 'siti@owner.com',
                'role' => 'owner',
                'status' => 'active',
            ],
            [
                'name' => 'Ahmad Wijaya',
                'email' => 'ahmad@owner.com',
                'role' => 'owner',
                'status' => 'active',
            ],
            [
                'name' => 'Dewi Lestari',
                'email' => 'dewi@owner.com',
                'role' => 'owner',
                'status' => 'active',
            ],
            [
                'name' => 'Rudi Hartono',
                'email' => 'rudi@owner.com',
                'role' => 'owner',
                'status' => 'suspended',
            ],
        ];

        foreach ($owners as $ownerData) {
            User::firstOrCreate(
                ['email' => $ownerData['email']],
                [
                    'name' => $ownerData['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'role' => $ownerData['role'],
                    'status' => $ownerData['status'],
                ]
            );
        }

        // Create Regular Users
        $users = [
            [
                'name' => 'John Doe',
                'email' => 'john@user.com',
                'role' => 'user',
                'status' => 'active',
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@user.com',
                'role' => 'user',
                'status' => 'active',
            ],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'role' => $userData['role'],
                    'status' => $userData['status'],
                ]
            );
        }

        $this->command->info('Users seeded successfully. Default password: password');
    }
}
