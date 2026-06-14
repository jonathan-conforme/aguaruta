<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Province extends Model
{
    

    protected $guarded = ['id'];

    // Una provincia tiene muchos cantones
    public function cantons()
    {
        return $this->hasMany(Canton::class);
    }
}