<?php

namespace App\Models;

use App\Models\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use BelongsToCompany, HasFactory;

    protected $fillable = [
        'company_id',
        'trip_id',
        'customer_id',
        'shift_id',
        'payment_method',
        'status',
        'paid_amount',
        'balance_amount',
        'total',

    ];

    // Una venta tiene MUCHOS detalles
    public function details()
    {
        return $this->hasMany(SaleDetail::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }

    // public function user(){
    //  return $this->belongsTo(User::class);
    // }
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // MVP 2: Facturación Electrónica SRI
    public function electronicDocument()
    {
        return $this->morphOne(ElectronicDocument::class, 'documentable');
    }
}
