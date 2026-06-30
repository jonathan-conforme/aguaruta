<?php

namespace App\Models;

use App\Models\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    use BelongsToCompany;

   protected $fillable = [
        'company_id',
        'trip_number',
        'driver_id',
        'seller_id',
        'helper_1_id',
        'helper_2_id',
        'delivery_route_id',
        'date',
        'status',
        'notes',
        'shift_id',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    // Relaciones con los usuarios (Empleados)
    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function helper1()
    {
        return $this->belongsTo(User::class, 'helper_1_id');
    }

    public function helper2()
    {
        return $this->belongsTo(User::class, 'helper_2_id');
    }

  // Relación MUCHOS A MUCHOS con Productos (A través de la tabla pivot)
    public function products()
    {
        return $this->belongsToMany(Product::class, 'trip_details', 'trip_id', 'product_id')
                    ->using(TripDetail::class)
                    ->withPivot('quantity', 'initial_quantity', 'returned_quantity', 'recovered_bottles', 'company_id') // 🔥 2. Agregamos company_id para que lo traiga en las consultas
                    ->withTimestamps();
    }
    public function route()
    {
        return $this->belongsTo(DeliveryRoute::class, 'delivery_route_id');
    }

    public function isActive()
{
    return $this->status === 'active';
}

public function isPending()
{
    return $this->status === 'pending';
}
    public function sales() {
    return $this->hasMany(Sale::class);
}

}
