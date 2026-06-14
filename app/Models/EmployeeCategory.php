<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EmployeeCategory extends Model
{
   protected $fillable = ['name', 'slug'];

    /**
     * Relación: Una categoría tiene muchos empleados.
     */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }
}