<?php

namespace App\Services;

use App\Models\User;

class SriService
{
    public function getCompanyData(User $user): array
    {
        $company = $user->company;

        return [
            'id'         => $company?->id,
            'name'       => $company?->name ?? 'AquaRutaTech Cía. Ltda.',
            'ruc_number' => $company?->ruc_number ?? $company?->ruc ?? 'Sin RUC',
            'email'      => $company?->email ?? $company?->correo ?? 'N/A',
            'phone'      => $company?->phone ?? $company?->telefono ?? $company?->whatsapp_number ?? 'N/A',
            'address'    => $company?->address ?? $company?->direccion ?? 'Sin dirección registrada',
            'plan'       => $company?->plan ?? 'básico',
            'logo'       => $company?->logo_url,
        ];
    }
}
