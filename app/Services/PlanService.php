<?php 
namespace App\Services;

use App\Models\Company;

class PlanService
{
    /**
     * Verifica si la empresa puede realizar una acción según su plan.
     */
    public function canPerformAction(Company $company, string $feature, string $category = 'modules'): bool
    {
        $plan = $company->plan; // 'basico', 'premium' o 'empresarial'
        $config = config("plans.{$plan}.{$category}.{$feature}");

        return $config === true;
    }

    /**
     * Obtiene el límite de un recurso específico.
     */
    public function getLimit(Company $company, string $limitName): int
    {
        $plan = $company->plan;
        return config("plans.{$plan}.limits.{$limitName}", 0);
    }
}
