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
    // Desactivar automáticamente empresas vencidas (Tu lógica actual)
    Company::where('subscription_ends_at', '<', now())
        ->where('is_active', true)
        ->update(['is_active' => false]);

    // Cargamos las empresas con sus usuarios
    $companies = Company::with('users')->latest()->paginate(15);

    // Obtenemos los planes disponibles desde config/plans.php
    // Esto devolverá: [['id' => 'basico', 'price' => 14.99], ...]
    $availablePlans = collect(config('plans'))->map(function ($details, $key) {
        return [
            'id' => $key,
            'price' => $details['price'],
            'name' => $key === 'basico' ? 'Básico' : ucfirst($key)
        ];
    })->values();

    return Inertia::render('SuperAdmin/Companies/index', [
        'companies' => $companies,
        'availablePlans' => $availablePlans
    ]);
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
    $data = $request->validated();
    $data['legal_accepted_ip'] = $request->ip();

    // El servicio se encarga de subir el logo y crear la empresa
    $this->companyService->createCompany($data);

    return redirect()->route('companies.index')->with('success', 'Empresa registrada correctamente.');
}

public function update(UpdateCompanyRequest $request, Company $company)
{
    $validated = $request->validated();

    // El servicio maneja la eliminación del logo antiguo y la subida del nuevo
    $this->companyService->updateCompany($company, $validated);

    return redirect()->route('companies.index')->with('success', 'Empresa actualizada correctamente.');
}

    /**
     * Remove the specified resource from storage.
     */
   public function destroy(Company $company)
    {
        // Lógica para eliminar la empresa
        $company->delete();

        return redirect()->route('companies.index')->with('success', 'Empresa eliminada correctamente.');
    }


   public function toggleStatus(Company $company)
{
    $company->update([
        'is_active' => !$company->is_active
    ]);

    return back()->with('success', 'Estado actualizado');
}
}
