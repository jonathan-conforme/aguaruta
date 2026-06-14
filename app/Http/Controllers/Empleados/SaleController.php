<?php

namespace App\Http\Controllers\Empleados;

use App\Http\Requests\Empleado\StoreSaleRequest;
use App\Http\Controllers\Controller;
use App\Services\SaleService;
use Illuminate\Http\Request;
use App\Models\Customer;
use Carbon\Carbon;
use App\Models\Shift;
use App\Models\Trip;
use App\Models\Sale;
use Inertia\Inertia;

class SaleController extends Controller
{
   
    protected $saleService;

    public function __construct(SaleService $saleService)
    {
        $this->saleService = $saleService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = auth()->user(); 
        $filterDate = $request->input('date', Carbon::today()->toDateString());

        // 1. Consulta base: 
        // CAMBIO CLAVE AQUÍ -> Cargamos 'shift.user' en lugar de 'user'
        $salesQuery = Sale::with(['customer', 'trip', 'shift.user', 'details.product'])
            ->where('company_id', $user->company_id);

        // 2. Lógica de Roles usando tu ENUM
        if ($user->role === 'empleado') { 
            // CAMBIO CLAVE AQUÍ -> Filtramos a través del Turno (shift)
            $salesQuery->whereHas('shift', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            });
        }

        // 3. Aplicamos el filtro de fecha
        if ($filterDate) {
            $salesQuery->whereDate('created_at', $filterDate);
        }

        $sales = $salesQuery->orderBy('created_at', 'desc')->get();

        // 4. Calculamos las métricas
        $totalEarned = $sales->sum('total');
        $salesByMethod = [
            'cash' => $sales->where('payment_method', 'cash')->sum('total'),
            'transfer' => $sales->where('payment_method', 'transfer')->sum('total'),
            'credit' => $sales->where('payment_method', 'credit')->sum('total'),
        ];

        // 5. Definimos la URL base para React
        $baseUrl = $user->role === 'empleado' ? '/empleado/sales' : '/admin/sales';

        return Inertia::render('Empleados/Pos/Index', [
            'sales' => $sales,
            'totalEarned' => $totalEarned,
            'salesByMethod' => $salesByMethod,
            'currentDateFilter' => $filterDate,
            'baseUrl' => $baseUrl
        ]);
    }

    

    /**
     * Show the form for creating a new resource.
     */
  public function create(Trip $trip)
{
    $user = auth()->user();

    if (
        $trip->status !== 'active' ||
        ($trip->seller_id !== $user->id && $trip->driver_id !== $user->id)
    ) {
        return redirect()
            ->route('employee.trips.index')
            ->with('error', 'Debes iniciar el viaje antes de vender.');
    }

    $trip->load('products.customerCategories');

    $customers = Customer::with('category')->orderBy('name', 'asc')->get();

    // solo informativo
    $shift = Shift::where('user_id', $user->id)
        ->where('status', 'open')
        ->first();

    return Inertia::render('Empleados/Pos/Create', [
        'trip' => $trip,
        'customers' => $customers,
        'shift' => $shift,
        'hasOpenShift' => $shift ? true : false,
    ]);
}

    /**
     * Store a newly created resource in storage.
     */
 /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSaleRequest $request)
    {
        try {
            $validated = $request->validated();

            $totalQuantity = collect($validated['products'])->sum('quantity');

            if ($totalQuantity <= 0) {
                return back()->withErrors([
                    'products' => 'Debes agregar al menos un producto a la venta.'
                ]);
            }

            $shift = Shift::where('user_id', auth()->id())
                ->where('status', 'open')
                ->first();

            if (!$shift) {
                return back()->withErrors([
                    'shift' => 'Debes abrir caja antes de vender.'
                ]);
            }

            // Llamamos al servicio (asegúrate de haber hecho los cambios que te dije en SaleService)
            $this->saleService->createMobileSale($validated, $shift);

            // Redirección exitosa
            return redirect()
                ->route('repartidor.sales.create', ['trip' => $validated['trip_id']]);

        } catch (\Exception $e) { // Cambié \Throwable por \Exception por seguridad
            
            // Logueamos el error para verlo en consola sin romper la pantalla
            \Log::error('Error registrando venta: ' . $e->getMessage());
            
            // Retornamos a la vista con el error para Inertia
            return back()->with('error', 'Ocurrió un error al registrar la venta: ' . $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sale $sale)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sale $sale)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sale $sale)
    {
        //
    }
}
