<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sector extends Model
{
    protected $guarded = ['id'];

    // Un sector pertenece a un cantón
    public function canton()
    {
        return $this->belongsTo(Canton::class);
    }
}