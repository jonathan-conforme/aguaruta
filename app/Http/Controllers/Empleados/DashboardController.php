<?php

namespace App\Http\Controllers\Empleados;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Empleados\EmpleadosDashboardService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $empleadosDashboardService;

    public function __construct(EmpleadosDashboardService $empleadosDashboardService)
    {
        $this->empleadosDashboardService = $empleadosDashboardService;
    }

  public function index()
    {
        // Obtenemos las estadísticas reales
        $data = $this->empleadosDashboardService->getStats(auth()->user()->company_id);

        // Renderizamos el componente React pasando los datos limpios
        return Inertia::render('Empleados/Dashboard', $data);
    }
}
