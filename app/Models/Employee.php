<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\CompanyScope;
use App\Models\Traits\BelongsToCompany;
use App\Models\EmployeeCategory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model

{
  use BelongsToCompany;


     /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
   protected $fillable = [
    'company_id',
    'employee_category_id',
    'identification',
    'first_name',
    'last_name',
    'email',
    'phone',
    'is_active'
];


    /**
     * Relación: Un empleado pertenece a una categoría.
     */
     public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }
    public function category()
{
    // relación con la categoría, usando el campo employee_category_id
    return $this->belongsTo(EmployeeCategory::class, 'employee_category_id');
}

public function user()
{
    // Vincula el empleado con el usuario usando la cédula como puente
    return $this->hasOne(User::class, 'email', 'identification');
}

}
