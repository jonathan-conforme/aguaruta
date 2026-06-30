<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use App\Models\EmployeeCategory;
use App\Rules\ValidarRucEcuador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Services\PlanService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;



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
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $company = auth()->user()->company;

  // 1. VALIDACIÓN GENERAL: El Scope Global ya filtra por la empresa actual automáticamente
$currentEmployeesCount = $company->employees()->count();

if ($this->planService->hasReachedLimit($company, 'employees', $currentEmployeesCount)) {
    $limiteEmployees = $this->planService->getLimit($company, 'employees');
    return back()->with('error', $this->planService->getLimitErrorMessage($company->plan, 'employees', $limiteEmployees));
}

// 2. VALIDACIÓN CONDICIONAL: El Scope Global también aplica para el conteo de usuarios
if ($request->boolean('create_user_account')) {

$currentUsersCount = $company->users()->where('role', '!=', 'admin')->count();

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
                'unique:employees,identification',
                new ValidarRucEcuador,
                // con esto evitamos que esta cédula ya exista como credencial de login en 'users'
                $request->boolean('create_user_account') ? 'unique:users,email' : ''
            ],

            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'employee_category_id' => 'required|exists:employee_categories,id',
            'email' => 'nullable|string|max:255|unique:users,email',
            'phone' => 'nullable|string|max:20',
        ]);

        $companyId = auth()->user()->company_id;

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
                'name' => $request->first_name . ' ' . $request->last_name,
                'email' => $request->identification, // 👈 Forzado: La cédula actúa como su login en 'users'
                'password' => bcrypt($request->identification), // 👈 Cédula como contraseña inicial
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

        $user = User::where('company_id', $companyId)
                    ->where(function($query) use ($employee) {
                        $query->where('email', $employee->identification);
                        if ($employee->email) {
                            $query->orWhere('email', $employee->email);
                        }
                    })
                    ->first();

        if (!$user) {
            return back()->with('error', 'No se encontró un usuario vinculado a este empleado.');
        }

        $nuevoEstado = !$user->is_active;
        $user->is_active = $nuevoEstado;
        $user->save();

        $employee->is_active = $nuevoEstado;
        $employee->save();

        return back()->with('success', 'Estado del empleado actualizado con éxito.');
    }

    public function resetPassword(Employee $employee)
{
    // Buscamos al usuario cuyo email coincide con la cédula o con el correo del empleado
    // Intentamos primero con la cédula (que es el usuario asignado por defecto para la app de campo)
    $user = User::where('email', $employee->identification)->first();

    // Si no lo encuentra por cédula, intentamos buscarlo por su correo personal (por si acaso)
    if (!$user && $employee->email) {
        $user = User::where('email', $employee->email)->first();
    }

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
}
