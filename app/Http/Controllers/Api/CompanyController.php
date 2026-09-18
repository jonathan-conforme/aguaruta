<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCompanyRequest;
use App\Services\CompanyService;
use Illuminate\Http\JsonResponse;

class CompanyController extends Controller
{
    public function __construct(
        protected CompanyService $companyService
    ) {}

    public function store(StoreCompanyRequest $request): JsonResponse
    {
        $company = $this->companyService->createCompany(
            $request->validated()
        );

        return response()->json([
            'message' => 'Empresa registrada correctamente.',
            'company' => $company,
        ], 201);
    }
}
