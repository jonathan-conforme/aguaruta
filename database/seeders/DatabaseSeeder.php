<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database in a strictly ordered, idempotent flow.
     */
    public function run(): void
    {
        // 1. Catálogos Geográficos e Infraestructura Base
        $this->call([
            ProvincieSeeder::class,
        ]);

        // 2. Creación Idempotente de Empresa Maestra y Super Admin
        $superAdminCompany = Company::firstOrCreate(
            ['name' => 'Mi SaaS AguaRuta'],
            ['is_active' => true]
        );

        User::firstOrCreate(
            ['email' => config('app.super_admin_email', 'Jonathanconformetomala@outlook.es')],
            [
                'company_id' => $superAdminCompany->id,
                'name' => 'Jonathan Conforme',
                'password' => Hash::make(env('SUPER_ADMIN_PASSWORD', '092195Tp.')),
                'role' => 'super_admin',
                'is_active' => true,
                'password_changed' => true,
                'accepted_terms_and_privacy' => true,
            ]
        );

        // 3. Catálogos y Entidades Padre (Requeridos por claves foráneas)
        $this->call([
            EmployeeCategorySeeder::class,
            CustomerCategorySeeder::class, // Evita QueryException 1452 en CustomerSeeder
            DeliveryRouteSeeder::class,    // Evita QueryException 1452 en CustomerSeeder
            ProductSeeder::class,
        ]);

        // 4. Entidades Operativas e Hijas (Dependen de las categorías y rutas)
        $this->call([
            CustomerSeeder::class,
        ]);
    }
}
