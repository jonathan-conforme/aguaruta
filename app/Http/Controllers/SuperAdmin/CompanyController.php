<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\StoreCompanyRequest;
use App\Services\CompanyService;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdateCompanyRequest;

class CompanyController extends Controller
{
    protected CompanyService $companyService;
    // Inyectamos el servicio en el constructor
    public function __construct(CompanyService $companyService)
    {
        $this->companyService = $companyService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
          Company::where('subscription_ends_at', '<', now())
        ->where('is_active', true)
        ->update(['is_active' => false]);

        $companies = Company::with('users')->latest()->paginate(50);
        return Inertia::render('SuperAdmin/Companies/index', [ 'companies' => $companies]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('SuperAdmin/Companies/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCompanyRequest $request)
    {
        
       // 1. Obtenemos todos los datos ya validados por tu FormRequest
        $data = $request->validated();

        // 2. PROCESAMOS EL LOGO
        // Verificamos si en la petición viene un archivo llamado 'logo'
        if ($request->hasFile('logo')) {
            // Guardamos el archivo físicamente en 'storage/app/public/logos'
            // Y reemplazamos el archivo temporal por la ruta real (ej: logos/imagen.png)
            $data['logo'] = $request->file('logo')->store('logos', 'public');
        }

        // 3. Enviamos los datos al servicio UNA SOLA VEZ
        $this->companyService->createCompany($data);
        // 3. Retornamos la respuesta
        return redirect()->route('companies.index')->with('success', 'Empresa registrada correctamente.');
    }
    

    /**
     * Display the specified resource.
     */
    public function show(Company $company)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Company $company)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
public function update(UpdateCompanyRequest $request, Company $company)
    { 
        // Si el código llega aquí, significa que ya pasó la validación del Request automáticamente
        $validated = $request->validated();

        // Procesar el nuevo Logo (si el usuario subió uno)
        if ($request->hasFile('logo')) {
            if ($company->logo) {
                Storage::disk('public')->delete($company->logo);
            }
            $validated['logo'] = $request->file('logo')->store('logos', 'public');
        } else {
            unset($validated['logo']);
        }

        // Actualizar la empresa
        $company->update($validated);

        return redirect()->route('companies.index')->with('success', 'Empresa actualizada correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company)
    {
        //
    }
   public function toggleStatus(Company $company)
{
    $company->update([
        'is_active' => !$company->is_active
    ]);

    return back()->with('success', 'Estado actualizado');
}
}
