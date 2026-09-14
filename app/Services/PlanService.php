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

        $plans = config('plans', []);

        // 1. Obtener el nombre legible del plan actual desde config/plans.php
        $currentPlanName = $plans[$plan]['name'] ?? ucfirst($plan);

        // 2. Determinar dinámicamente el siguiente plan disponible en la escala
        $planKeys = array_keys($plans);
        $currentIndex = array_search($plan, $planKeys);
        $nextPlanKey = ($currentIndex !== false && isset($planKeys[$currentIndex + 1])) 
            ? $planKeys[$currentIndex + 1] 
            : null;

        $nextPlanName = $nextPlanKey ? ($plans[$nextPlanKey]['name'] ?? null) : null;

        // 3. Generar mensaje según si existe un plan superior o si está en el nivel máximo
        if ($nextPlanName) {
            return "Has alcanzado el límite de {$limit} {$name} permitido en el Plan {$currentPlanName}. Para agregar más, actualiza al Plan {$nextPlanName}.";
        }

        return "Has alcanzado el límite de {$limit} {$name} permitido en el Plan {$currentPlanName}. Si necesitas más capacidad, contacta con soporte.";
    

    }
}
