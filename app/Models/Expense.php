<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToCompany;

class Expense extends Model
{
    use BelongsToCompany;

    protected $fillable = [
        'company_id',
        'shift_id',
        'user_id',
        'amount',
        'category',
        'description',
        'receipt_photo_url',
    ];

    // Relaciones

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }
    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }
}

