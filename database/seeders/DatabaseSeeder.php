<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {


    //catálogos base (Provincias, Cantones, Sectores)  
    $this->call(ProvincieSeeder::class);

       // Empresa Maestra
    $superAdminCompany = \App\Models\Company::create([
        'name' => 'Mi SaaS AguaRuta', // Cambia el nombre si quieres
        'is_active' => true,
        
    ]);

    //Super Admin
    \App\Models\User::create([
        'company_id' => $superAdminCompany->id,
        'name' => 'Jonathan Conforme', // Pon tu nombre real
        'email' => 'Jonathanconformetomala@outlook.es', // Tu correo real
        'password' => bcrypt('092195Tp.'), 
        'role' => 'super_admin',
    ]);
    $this->call(EmployeeCategorySeeder::class);
}
}
