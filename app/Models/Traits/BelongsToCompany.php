<?php

namespace App\Models\Traits;

use App\Models\Scopes\CompanyScope;
use App\Models\Company;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait BelongsToCompany
{
   protected static function booted()
{
    static::addGlobalScope(new CompanyScope);

    static::creating(function ($model) {
        if (auth()->check() && empty($model->company_id)) {
            $model->company_id = auth()->user()->company_id;
        }
    });
}
    // De paso, ya te dejamos lista la relación con la empresa
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}