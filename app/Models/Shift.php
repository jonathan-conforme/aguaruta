<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToCompany;


class Shift extends Model
{
    use HasFactory, BelongsToCompany;


    protected $fillable = [
        'company_id',
        'user_id',
        'opened_at',
        'closed_at',
        'initial_cash',
        'final_cash',
        'status',
    ];

    // Castear las fechas para trabajar cómodamente con Carbon
    protected $casts = [
        'opened_at' => 'datetime',
        'closed_at' => 'datetime',
        'initial_cash' => 'decimal:2',
        'final_cash' => 'decimal:2',
    ];

    // Relación con el usuario (repartidor)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación con las ventas del turno
    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function trips()
    {
        return $this->hasMany(Trip::class);
    }
    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }
}
