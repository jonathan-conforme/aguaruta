<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToCompany;

class ElectronicDocument extends Model
{
    use BelongsToCompany;

    protected $fillable = [
        'company_id',
        'document_type',
        'access_key',
        'sequential',
        'sri_status',
        'xml_path',
        'pdf_path',
        'sri_response',
    ];

    protected $casts = [
        'sri_response' => 'array',
    ];

    public function documentable()
    {
        return $this->morphTo();
    }
}
