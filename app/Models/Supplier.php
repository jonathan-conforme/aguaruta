<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToCompany;

class Supplier extends Model
{
   use BelongsToCompany;
   
   protected $fillable = [
        'company_id',
        'name',
        'contact_name',
        'phone',
        'email',
        'address',
        'ruc_or_id'
   ];
   public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
