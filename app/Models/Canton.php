<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Canton extends Model
{
    protected $guarded = ['id'];

    // Un cantón pertenece a una provincia
    public function province()
    {
        return $this->belongsTo(Province::class);
    }

    // Un cantón tiene muchos sectores
    public function sectors()
    {
        return $this->hasMany(Sector::class);
    }
    
}