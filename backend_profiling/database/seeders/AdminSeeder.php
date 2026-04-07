<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Only create if no admin exists yet
        if (User::where('Role', 'Admin')->exists()) {
            $this->command->info('Admin already exists, skipping.');
            return;
        }

        User::create([
            'User_ID'        => 'USR-ADMIN1',
            'Username'       => env('ADMIN_USERNAME', 'admin'),
            'Password'       => Hash::make(env('ADMIN_PASSWORD', 'Admin@1234')),
            'Role'           => 'Admin',
            'Account_Status' => 'Active',
        ]);

        $this->command->info('Admin user created.');
    }
}
