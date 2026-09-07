<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SriService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SriController extends Controller
{
    public function __construct(
        protected SriService $sriService
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Sri/Index', [
            'company' => $this->sriService->getCompanyData($request->user()),
            'guias'   => [], // Aquí conectarás el modelo GuiaRemision en el MVP2
        ]);
    }
}
