<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Employee;
use App\Models\EmployeeCategory;
use App\Models\User;
use App\Rules\ValidarRucEcuador;
use App\Services\PlanService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    // 🌟 2. Inyectamos el PlanService en tu constructor junto al de Laravel
    public function __construct(private PlanService $planService) {}

    public function index()
    {
        $employees = Employee::with('category', 'user')
            ->orderBy('id', 'desc')
            ->get();

        $categories = EmployeeCategory::orderBy('name', 'asc')->get();

        return Inertia::render('Admin/Employees/Index', [
            'employees' => $employees,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $company = auth()->user()->company;
        $companyId = $company->id;

        // 1. VALIDACIÓN GENERAL: El Scope Global ya filtra por la empresa actual automáticamente
        $currentEmployeesCount = $company->employees()->where('is_active', true)->count();

        if ($this->planService->hasReachedLimit($company, 'employees', $currentEmployeesCount)) {
            $limiteEmployees = $this->planService->getLimit($company, 'employees');

            return back()->with('error', $this->planService->getLimitErrorMessage($company->plan, 'employees', $limiteEmployees));
        }

        // 2. VALIDACIÓN CONDICIONAL: El Scope Global también aplica para el conteo de usuarios
        if ($request->boolean('create_user_account')) {

            $currentUsersCount = $company->users()
                ->where('role', '!=', 'admin')
                ->where('is_active', true) // Solo contar usuarios activos
                ->count();

            if ($this->planService->hasReachedLimit($company, 'app_users', $currentUsersCount)) {
                $limiteUsers = $this->planService->getLimit($company, 'app_users');

                return back()->with('error', $this->planService->getLimitErrorMessage($company->plan, 'app_users', $limiteUsers));
            }
        }

        // --- DE AQUÍ PARA ABAJO TU CÓDIGO SIGUE EXACTAMENTE IGUAL ---
        $request->validate([
            'identification' => [
                'required',
                'string',
                Rule::unique('employees', 'identification')->where('company_id', $companyId),
                new ValidarRucEcuador,
                // con esto evitamos que esta cédula ya exista como credencial de login en 'users'
            ],
            'email' => [
                'nullable',
                'string',
                'max:255',
                $request->boolean('create_user_account')
                    ? Rule::unique('users', 'email')->where('company_id', $companyId)
                    : '',
            ],

            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'employee_category_id' => 'required|exists:employee_categories,id',
            'phone' => 'nullable|string|max:20',
        ]);

        DB::transaction(function () use ($request, $companyId) {
            Employee::create([
                'company_id' => $companyId,
                'employee_category_id' => $request->employee_category_id,
                'identification' => $request->identification,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'is_active' => true,
            ]);

            // Guardamos el Usuario de Acceso si el Switch está encendido
            if ($request->boolean('create_user_account')) {
                User::create([
                    'company_id' => $companyId,
                    'name' => $request->first_name.' '.$request->last_name,
                    'email' => $request->identification, //
                    'password' => bcrypt($request->identification),
                    'role' => 'empleado',
                    'is_active' => true,
                ]);
            }
        });

        return back()->with('success', 'Empleado creado correctamente.');
    }

    public function toggleStatus(Employee $employee)
    {
        $companyId = auth()->user()->company_id;
        $company = Company::find($companyId);

        // 🟢 1. Si la intención es ACTIVAR (actualmente está inactivo), validamos límites del plan
        if (! $employee->is_active) {

            // Validar límite de Empleados
            $currentEmployeesCount = $company->employees()->where('is_active', true)->count();

            if ($this->planService->hasReachedLimit($company, 'employees', $currentEmployeesCount)) {
                $limiteEmployees = $this->planService->getLimit($company, 'employees');

                return back()->with('error', $this->planService->getLimitErrorMessage($company->plan, 'employees', $limiteEmployees));
            }

            // Buscar si el empleado tiene cuenta de usuario vinculada
            $userPending = User::where('company_id', $companyId)
                ->where(function ($query) use ($employee) {
                    $query->where('email', $employee->identification);
                    if ($employee->email) {
                        $query->orWhere('email', $employee->email);
                    }
                })
                ->first();

            // Validar límite de Usuarios App si aplica
            if ($userPending) {
                $currentUsersCount = $company->users()
                    ->where('role', '!=', 'admin')
                    ->where('is_active', true)
                    ->count();

                if ($this->planService->hasReachedLimit($company, 'app_users', $currentUsersCount)) {
                    $limiteUsers = $this->planService->getLimit($company, 'app_users');

                    return back()->with('error', $this->planService->getLimitErrorMessage($company->plan, 'app_users', $limiteUsers));
                }
            }
        }

        // 1. Cambiar estado a la ficha del empleado
        $employee->is_active = ! $employee->is_active;
        $employee->save();

        $user = User::where('company_id', $companyId)
            ->where(function ($query) use ($employee) {
                $query->where('email', $employee->identification);
                if ($employee->email) {
                    $query->orWhere('email', $employee->email);
                }
            })
            ->first();

        if ($user) {
            $user->is_active = $employee->is_active;
            $user->save();

        }

        $estado = $employee->is_active ? 'activado' : 'desactivado';

        return back()->with('success', "Estado del empleado {$estado} correctamente.");
    }

    public function resetPassword(Employee $employee)
    {

        $companyId = auth()->user()->company_id;
        $user = User::where('company_id', $companyId)
            ->where(function ($query) use ($employee) {
                $query->where('email', $employee->identification);
                if ($employee->email) {
                    $query->orWhere('email', $employee->email);
                }
            })
            ->first();

        // Si encontramos al usuario, hacemos el reset completo
        if ($user) {
            $user->update([
                'password' => Hash::make($employee->identification), // 🔑 Vuelve a ser su número de cédula
                'password_changed' => false, // 🔒 Se bloquea de nuevo para obligarlo a cambiarla en el primer login
            ]);

            return back()->with('success', "La contraseña de {$employee->first_name} ha sido restablecida con éxito a su número de cédula.");
        }

        // Si no existe un usuario en la tabla 'users' con esa identificación o email
        return back()->with('error', 'Este empleado no cuenta con un usuario activo en el sistema.');
    }
    /**
     * Historial de cobros realizados por el empleado autenticado.
     */
}
