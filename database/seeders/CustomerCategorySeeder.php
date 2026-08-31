<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CustomerCategory;
use Illuminate\Database\Seeder;

class CustomerCategorySeeder extends Seeder
{
    public function run(): void
    {
        // Obtiene la empresa existente o crea la empresa operativa
        $company = Company::firstOrCreate(
            ['name' => 'Embotelladora Demo'],
            ['is_active' => true]
        );

        CustomerCategory::firstOrCreate(
            ['company_id' => $company->id, 'name' => 'General'],
            ['is_active' => true]
        );

        CustomerCategory::firstOrCreate(
            ['company_id' => $company->id, 'name' => 'Mayorista'],
            ['is_active' => true]
        );
    }
}
