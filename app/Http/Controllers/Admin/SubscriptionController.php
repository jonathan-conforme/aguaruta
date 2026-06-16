<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        // 1. Obtenemos la empresa vinculada al usuario autenticado (mediante tu relación o helper)
        $company = auth()->user()->company;

        // 2. Cargamos todo el archivo de configuración config/plans.php
        $allPlans = config('plans');

        // 3. Renderizamos la vista enviando los datos específicos
        return Inertia::render('Admin/Subscription/Index', [
            'currentPlanName' => $company->plan, // 'basico', 'premium', 'empresarial'
            'subscriptionEndsAt' => $company->subscription_ends_at,
            'allPlans' => $allPlans,
        ]);
    }
}
