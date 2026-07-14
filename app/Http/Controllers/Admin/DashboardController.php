<?php

namespace App\Http\Controllers\Admin; // Convención: Admin con mayúscula si tu carpeta lo es

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Admin\AdminDashboardService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $adminDashboardService;

    public function __construct(AdminDashboardService $adminDashboardService)
    {
        $this->adminDashboardService = $adminDashboardService;
    }

  public function index()
    {
        // Obtenemos las estadísticas reales
        $data = $this->adminDashboardService->getStats(auth()->user()->company_id);

        // Renderizamos el componente React pasando los datos limpios
        return Inertia::render('Admin/Dashboard', $data);
    }
}
