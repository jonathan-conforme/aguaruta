<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class EmployeeService
{
    /**
     * Registra un empleado y le crea automáticamente su cuenta de usuario.
     */
    public function registerEmployee(array $data, int $companyId): Employee
    {
        return DB::transaction(function () use ($data, $companyId) {
            // 1. Crear el empleado
            $employee = Employee::create([
                'company_id'           => $companyId,
                'employee_category_id' => $data['employee_category_id'],
                'identification'       => $data['identification'],
                'first_name'           => $data['first_name'],
                'last_name'            => $data['last_name'],
                'email'                => $data['email'] ?? null,
                'phone'                => $data['phone'] ?? null,
                'is_active'            => true,
            ]);

            // 2. Crear el usuario vinculado
            User::create([
                'company_id' => $companyId,
                'name'       => $data['first_name'] . ' ' . $data['last_name'],
                'email'      => $data['email'] ?? $data['identification'],
                'password'   => bcrypt($data['identification']), // Cédula como clave inicial
                'role'       => 'empleado',
                'is_active'  => true,
            ]);

            return $employee;
    });
    }
}
