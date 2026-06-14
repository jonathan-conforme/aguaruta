<?php

namespace App\Services;

use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\hash;


class CompanyService
{
    /**
     * Crea una nueva empresa y configura sus datos iniciales.
     */
    public function createCompany(array $data): Company
    {
        // Usamos DB::transaction por si en el futuro queremos 
        // crear también al Usuario Administrador de esta empresa al mismo tiempo
        return DB::transaction(function () use ($data) {
            
            // 1. Preparamos los datos
            $data['is_active'] = true;
            
          

            // 2. Creamos la empresa
            $company = Company::create($data);

            User::create ([
                'company_id' => $company->id,
                'name' => 'Admin de ' . $company->name,
                'email' => $data['email'],
                'password' => Hash::make($data['ruc_number']), 
                'role' => 'admin',
                'is_active' => true,
            ]);

            Log::info("Nueva empresa registrada: {$company->name} (RUC: {$company->ruc_number})");

            return $company;
        });
    }
}