<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CustomerService;
use App\Models\CustomerCategory;
use App\Rules\ValidarRucEcuador;
use App\Services\PlanService;
use Illuminate\Validation\Rule;
use App\Models\DeliveryRoute;
use Illuminate\Http\Request;
use App\Models\Customer;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function __construct(
        protected CustomerService $customerService,
        private PlanService $planService
    ) {}

    public function index()
    {
        return Inertia::render('Admin/Customers/Index', [
            'customers' => $this->customerService->getAllCustomers(),
            'categories' => CustomerCategory::all(),
            'routes' => DeliveryRoute::all()
        ]);
    }

   public function store(Request $request)
    {
        $companyId = auth()->user()->company_id;
        $company = auth()->user()->company;

        if ($this->planService->hasReachedLimit($company, 'clients', Customer::count())) {
            $limite = $this->planService->getLimit($company, 'clients');
            $mensajeError = $this->planService->getLimitErrorMessage($company->plan, 'clients', $limite);

            return back()->with('error', $mensajeError);
        }

        $validated = $request->validate([
            'customer_category_id' => [
                'required',
                Rule::exists('customer_categories', 'id')->where('company_id', $companyId) // <-- Seguridad Multi-Tenant
            ],
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'bottle_debt' => 'nullable|integer|min:0',
            'delivery_route_id' => [
                'required',
                Rule::exists('delivery_routes', 'id')->where('company_id', $companyId) // <-- Seguridad Multi-Tenant
            ],
            'identification' => [
                'nullable',
                'string',
                'max:20',
                new ValidarRucEcuador,
                Rule::unique('customers', 'identification')->where('company_id', $companyId) // <-- Más limpio
            ],
        ]);

        $this->customerService->createCustomer($validated);

        return back()->with('success', 'Cliente registrado correctamente');
    }

    public function update(Request $request, Customer $customer)
    {
        $companyId = auth()->user()->company_id;

        $validated = $request->validate([
            'customer_category_id' => [
                'required',
                Rule::exists('customer_categories', 'id')->where('company_id', $companyId)
            ],
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'bottle_debt' => 'nullable|integer|min:0',
            'delivery_route_id' => [
                'required',
                Rule::exists('delivery_routes', 'id')->where('company_id', $companyId)
            ],
            'identification' => [
                'nullable',
                'string',
                'max:20',
                new ValidarRucEcuador,
                Rule::unique('customers', 'identification')
                    ->where('company_id', $companyId)
                    ->ignore($customer->id) // <-- Ignora el cliente actual al actualizar
            ],
        ]);

        $this->customerService->updateCustomer($customer, $validated);

        return back()->with('success', 'Cliente actualizado correctamente');
    }

    public function destroy(Customer $customer)
    {
        $this->customerService->deleteCustomer($customer);
        return back()->with('success', 'Cliente eliminado');
    }
}
