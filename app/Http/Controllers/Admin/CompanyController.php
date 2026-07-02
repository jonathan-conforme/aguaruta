<?php
namespace App\Http\Controllers;

use App\Models\Company;
use App\Services\PlanService;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index(PlanService $planService)
    {
        $company = auth()->user()->company; // Asumiendo relación en el modelo User

        return Inertia::render('Dashboard', [
            'companyPlan' => $company->plan,
            'canAccessPurchases' => $planService->canPerformAction($company, 'purchases'),
            'employeeLimit' => $planService->getLimit($company, 'employees'),
        ]);
    }

    
}
