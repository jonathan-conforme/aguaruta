<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EmployeeCategory extends Model
{
    use HasFactory;
    
   protected $fillable = ['name', 'slug'];


    /**
     * Relación: Una categoría tiene muchos empleados.
     */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }
}
