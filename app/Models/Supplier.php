<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
   use BelongsToCompany, SoftDeletes;

   protected $fillable = [
        'company_id',
        'name',
        'contact_name',
        'phone',
        'email',
        'address',
        'ruc_or_id'
   ];
   public function company(): BelongsToCompany
    {
        return $this->belongsTo(Company::class);
    }
}
