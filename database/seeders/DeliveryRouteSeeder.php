<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\DeliveryRoute;
use App\Models\Sector;
use Illuminate\Database\Seeder;

class DeliveryRouteSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::firstOrCreate(
            ['name' => 'Embotelladora Demo'],
            ['is_active' => true]
        );

        $sectorId = Sector::first()?->id;

        DeliveryRoute::firstOrCreate(
            [
                'company_id' => $company->id,
                'route_name' => 'Ruta 1 - Centro Histórico', // Se usa route_name en lugar de name
            ],
            [
                'sector_id' => $sectorId,
                'canton_id' => $sectorId,

                'is_active' => true,
            ]
        );

        DeliveryRoute::firstOrCreate(
            [
                'company_id' => $company->id,
                'route_name' => 'Ruta 2 - Zona Norte',
            ],
            [
                'sector_id' => $sectorId,
                'canton_id' => $sectorId,


                'is_active' => true,
            ]
        );
    }
}
