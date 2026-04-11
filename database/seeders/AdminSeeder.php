<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@sinerginusa.id'],
            [
                'name' => 'Admin Sinergi Nusa',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'user@nusantara.id'],
            [
                'name' => 'Budi Kontributor',
                'password' => Hash::make('password'),
                'role' => 'user',
            ]
        );
    }
}
