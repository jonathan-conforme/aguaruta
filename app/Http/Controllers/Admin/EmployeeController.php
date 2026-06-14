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
use Inertia\Inertia;


class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       // El Global Scope ya filtra automáticamente los empleados por la empresa del admin logueado
        $employees = Employee::with('category')
            ->orderBy('id', 'desc')
            ->get();

        $categories = EmployeeCategory::orderBy('name', 'asc')->get();

        return Inertia::render('Admin/Employees/Index', [
            'employees' => $employees,
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
      $companyId = auth()->user()->company_id;
$company = auth()->user()->company;

// Límite dinámico desde config
$limiteEmpleados = $company->getLimit('employees');

// Total empleados (tu Global Scope ya aplica)
$totalEmployees = \App\Models\Employee::count();

// VALIDACIÓN DE LÍMITES
if ($limiteEmpleados !== null && $totalEmployees >= $limiteEmpleados) {

    // Mensaje 
    $mensajeError = match ($company->plan) {
        'basico' => "Has alcanzado el límite de {$limiteEmpleados} empleados permitido en el Plan Básico. Para agregar más empleados, puedes actualizar al Plan Premium o Empresarial.",
        
        'premium' => "Has alcanzado el límite de {$limiteEmpleados} empleados permitido en el Plan Premium. Para continuar agregando empleados, considera cambiar al Plan Empresarial.",
        
        'empresarial' => "Has alcanzado el límite de empleados permitido en tu plan actual. Si necesitas más capacidad, contacta con soporte.",
        
        default => "Has alcanzado el límite de empleados permitido para tu plan actual.",
    };

    return back()->with('error', $mensajeError);
}

        $request->validate([
            // Validamos que la cédula sea única en la tabla employees y que cumpla con el formato de RUC ecuatoriano
            'identification' => [
                'required', 
                'string', 
                'unique:employees,identification', 
                new ValidarRucEcuador
            ],
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'employee_category_id' => 'required|exists:employee_categories,id',
            'email' => 'nullable|string|max:255|unique:users,email',
            'phone' => 'nullable|string|max:20',
        ]);
DB::transaction(function () use ($request, $companyId) {
        $employe = Employee::create([
            'company_id' => $companyId,
            'employee_category_id' => $request->employee_category_id,
            'identification' => $request->identification, 
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'is_active' => true, // Activamos al empleado por defecto
        ]);
    
        // CREAMOS EL USUARIO PARA CUALQUIER EMPLEADO
        User::create([
            'company_id' => $companyId,
            'name' => $request->first_name . ' ' . $request->last_name,
            'email' => $request->email ?? $request->identification,
            'password' => bcrypt($request->identification), // Cédula como contraseña inicial
            'role' => 'empleado', //Se guarda el rol 
            'is_active' => true, // Asegúrate de activar la cuenta por defecto
        ]);
    });

    return back()->with('success', 'Empleado registrado y cuenta de acceso creada con éxito.');
}

    

    /**
     * Display the specified resource.
     */
    public function show(Employee $employee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employee $employee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Employee $employee)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee)
    {
        //
    }
    public function toggleStatus(Employee $employee)
    {
        $companyId = auth()->user()->company_id;

        // El Global Scope ya valida que pertenezca a la misma empresa. 
        // Si no pertenece, Laravel lanzará un error 404 automáticamente.
        
        // Buscamos al usuario usando su cédula o su correo
        $user = User::where('company_id', $companyId)
                    ->where(function($query) use ($employee) {
                        $query->where('email', $employee->Identification);
                        
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
}