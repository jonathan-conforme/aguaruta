<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'ruc_number',
        'phone',
        'whatsapp_number',
        'email',
        'address',
        'is_active',
        'logo',
        'plan',
        'subscription_ends_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'subscription_ends_at' => 'date',
    ];
     // relación con User
    public function users()
    {
        return $this->hasMany(User::class);
    }

      public function planConfig()
    {
        return config("plans.{$this->plan}");
    }
    public function getLimit($key)
    {
        return $this->planConfig()['limits'][$key] ?? null;
    }
    public function hasModule($module): bool
    {
        return $this->planConfig()['modules'][$module] ?? false;
    }
    
}