<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToCompany;


class DeliveryRoute extends Model
{
    use BelongsToCompany;

    protected $fillable = [
        'company_id',
        'route_name',
        'city',
        'canton_id',
        'sector_id',
        'is_active'
    ];

    //relacion con clientes
    public function customers()
{
    return $this->hasMany(Customer::class, 'delivery_route_id');
}

    //relacion con viajes
    public function trips()
    {
        return $this->hasMany(Trip::class, 'delivery_route_id');
    }
    public function canton()
    {
        return $this->belongsTo(Canton::class);
    }
    public function sector()
    {
        return $this->belongsTo(Sector::class);
    }

}
