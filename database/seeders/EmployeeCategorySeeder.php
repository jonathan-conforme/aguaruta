<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EmployeeCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         
   $categories = [
            'Repartidor', 
            'Operador de Planta', 
            'Oficinista / Administración', 
            'Vendedor',
            'Supervisor de Calidad',
            'Mantenimiento',
            'Chofer'
        ];

        foreach ($categories as $category) {
            // Usamos updateOrInsert para que si vuelves a correr el seeder, 
            // no te duplique los registros, solo los actualice.
            DB::table('employee_categories')->updateOrInsert(
                ['slug' => Str::slug($category)], // Busca por el slug
                [
                    'name' => $category, 
                    'created_at' => now(), 
                    'updated_at' => now()
                ]
            );
        }
    }
}

