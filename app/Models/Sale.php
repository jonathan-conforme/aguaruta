<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToCompany; 


class Sale extends Model
{
    use HasFactory, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'trip_id',
        'customer_id',
        'shift_id',
        'payment_method',
        'total',
        
    ];

    //Una venta tiene MUCHOS detalles
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

    public function user(){
        return $this->belongsTo(User::class);
    }
    

}