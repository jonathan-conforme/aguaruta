<?php

namespace App\Http\Controllers\SuperAdmin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Muestra el panel principal con las métricas globales del SaaS.
     */
    public function index()
    {
        // 1. Total de purificadoras registradas
        $totalCompanies = Company::count();

        // 2. Administradores de empresas (dueños de purificadoras)
        $totalAdmins = User::where('role', 'admin')->count();

        // 3. Empleados operativos
        $totalEmployees = User::where('role', 'empleado')->count();

        return Inertia::render('SuperAdmin/Dashboard', [
            'totalCompanies' => $totalCompanies,
            'totalAdmins'    => $totalAdmins,
            'totalEmployees' => $totalEmployees,
        ]);
    }
}
