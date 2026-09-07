<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // 1. Catálogos Base
        $this->call([
            ProvincieSeeder::class,
            EmployeeCategorySeeder::class,
        ]);

        // 2. Empresa Maestra
        $superAdminCompany = Company::firstOrCreate(
            ['name' => 'Mi SaaS AguaRuta'],
            ['is_active' => true]
        );

        // 3. Credenciales de Super Admin desde .env
        $adminEmail = env('SUPER_ADMIN_EMAIL', 'admin@tusaas.com');
        $adminPassword = env('SUPER_ADMIN_PASSWORD');

        if (!$adminPassword) {
            $adminPassword = Str::random(16);
            $this->command->warn("SUPER_ADMIN_PASSWORD no está definida en .env");
            $this->command->info("Clave temporal generada para {$adminEmail}: {$adminPassword}");
        }

        // 4. Usuario Super Admin
        User::firstOrCreate(
            ['email' => $adminEmail],
            [
                'company_id' => $superAdminCompany->id,
                'name' => 'Super Admin',
                'password' => Hash::make($adminPassword),
                'role' => 'super_admin',
                'is_active' => true,
                'password_changed' => false,
                'accepted_terms_and_privacy' => true,
            ]
        );
    }
}
