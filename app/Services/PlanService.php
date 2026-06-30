<?php

namespace App\Services;

use App\Models\Company;

class PlanService
{
    /**
     * Verifica si la empresa puede realizar una acción según su plan.
     * (MANTENIDO INTACTO)
     */
    public function canPerformAction(Company $company, string $feature, string $category = 'modules'): bool
    {
        $plan = $company->plan; // 'basico', 'premium' o 'empresarial'
        $config = config("plans.{$plan}.{$category}.{$feature}");

        return $config === true;
    }

    /**
     * Obtiene el límite de un recurso específico.
     * (MANTENIDO INTACTO)
     */
    public function getLimit(Company $company, string $limitName): int
    {
        $plan = $company->plan;
        return config("plans.{$plan}.limits.{$limitName}", 0);
    }

    // =========================================================================
    // 🌟 NUEVOS MÉTODOS (No rompen nada de lo anterior, solo complementan)
    // =========================================================================

    /**
     * Verifica si la empresa ya alcanzó o superó el límite de un recurso.
     */
    public function hasReachedLimit(Company $company, string $limitName, int $currentCount): bool
    {
        $limit = $this->getLimit($company, $limitName);

        return $currentCount >= $limit;
    }

    /**
     * Genera el mensaje de error personalizado según el plan y el recurso.
     */
    public function getLimitErrorMessage(string $plan, string $feature, int $limit): string
    {
        $features = [
            'employees'      => 'empleados',
            'app_users'      => 'cuentas para repartidores',
            'clients'        => 'clientes',
            'products'       => 'productos',
            'routes_per_day' => 'rutas diarias',
        ];

        $name = $features[$feature] ?? $feature;

        return match ($plan) {
            'basico'      => "Has alcanzado el límite de {$limit} {$name} permitido en el Plan Básico. Para agregar más, actualiza al Plan Premium o Empresarial.",
            'premium'     => "Has alcanzado el límite de {$limit} {$name} permitido en el Plan Premium. Para continuar, considera cambiar al Plan Empresarial.",
            'empresarial' => "Has alcanzado el límite de {$name} permitido en tu plan actual. Si necesitas más capacidad, contacta con soporte.",
            default       => "Has alcanzado el límite de {$name} permitido para tu plan actual.",
        };
    }
}
