<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Carbon\Carbon;

class ProvincieSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $jsonPath = database_path('seeders/data/ecuador.json');
        
        if (!File::exists($jsonPath)) {
            $this->command->error("El archivo ecuador.json no existe en database/seeders/data/");
            return;
        }

        $provincesData = json_decode(File::get($jsonPath), true);

        $this->command->info('Iniciando la migración de Provincias, Cantones y Sectores...');

        foreach ($provincesData as $provinceData) {
            // Insertar Provincia
            $provinceId = DB::table('provinces')->insertGetId([
                'name' => $provinceData['name'],
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            foreach ($provinceData['cantons'] as $cantonData) {
                // Insertar Cantón
                $cantonId = DB::table('cantons')->insertGetId([
                    'province_id' => $provinceId,
                    'name' => $cantonData['name'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);

                // Preparar array de Sectores (Solo si existen en el JSON)
                $sectorsToInsert = [];
                $sectors = $cantonData['sectors'] ?? []; 
                
                foreach ($sectors as $sectorName) {
                    $sectorsToInsert[] = [
                        'canton_id' => $cantonId,
                        'name' => $sectorName,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }

                // Insertar Sectores masivamente si hay datos
                if (!empty($sectorsToInsert)) {
                    DB::table('sectors')->insert($sectorsToInsert);
                }
            }
        }

        $this->command->info('¡Catálogo geográfico poblado con éxito!');
    }
}