<?php

namespace App\Http\Controllers\Empleados;

use App\Services\ShiftClosureService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Shift;
use App\Services\ShiftService;
use Inertia\Inertia;

class ShiftsController extends Controller
{
    protected $closureService; // Corregido el nombre de la variable (decía $cloneService)
    protected $shiftService;

    public function __construct(
        ShiftClosureService $closureService,
        ShiftService $shiftService
    ) {
        $this->closureService = $closureService;
        $this->shiftService = $shiftService;
    }

    /**
     * Display a listing of the resource.
     */
        public function index()
        {

            return Inertia::render('Admin/Shifts/Index', [
                'shifts' => $this->shiftService->getEmployeeShifts(),
                
            ]);
        }

    /**
     * Show the form for creating a new resource.
     * (Muestra la pantalla de Apertura de Caja)
     */
    public function create()
    {
        // 1. Verificamos si el usuario ya tiene una caja abierta
        $activeShift = Shift::where('user_id', auth()->id())
            ->where('status', 'open')
            ->first();

        // Si ya tiene una, lo mandamos a sus rutas
        if ($activeShift) {
            return redirect()->route('repartidor.trips.index')
                ->with('info', 'Ya tienes una caja abierta.');
        }

        // Si no tiene, mostramos la pantalla de Inertia para abrir caja
        return Inertia::render('Empleados/Shifts/Create');
    }

    /**
     * Store a newly created resource in storage.
     * (Guarda la apertura de caja en la Base de Datos)
     */
    public function store(Request $request)
    {
        $request->validate([
            'initial_cash' => ['required', 'numeric', 'min:0'],
        ]);

        // Verificamos por seguridad que no tenga ya una abierta
        $activeShift = Shift::where('user_id', auth()->id())
            ->where('status', 'open')
            ->first();

        if ($activeShift) {
            return redirect()->route('repartidor.trips.index');
        }

        // Creamos la caja en estado 'open'
        Shift::create([
            'user_id'      => auth()->id(),
            'company_id'   => auth()->user()->company_id, // Asegura de vincularlo a su empresa
            'initial_cash' => $request->initial_cash,
            'opened_at'    => now(),
            'status'       => 'open',
        ]);

        return redirect()->route('repartidor.trips.index')
            ->with('success', 'Caja abierta exitosamente. ¡Puedes iniciar tu ruta!');
    }

    /**
     * Display the specified resource.
     */
    public function showClosure()
    {
        // Buscamos el turno abierto del usuario actual
        $activeShift = Shift::where('user_id', auth()->id())
            ->where('status', 'open')
            ->first();

        // 2. Si no hay turno activo, lo regresamos a donde tenga sentido
        // (por ejemplo, a su panel principal) con un mensaje de error o advertencia.
        if (!$activeShift) {
            // NOTA: Cambia 'dashboard' por el nombre de la ruta principal de tu repartidor
            return redirect()->route('dashboard')
                ->with('info', 'No tienes un turno abierto actualmente para realizar el corte.');
        }

        // 3. El resto de tu código queda igual, ya que ahora sabemos que $activeShift sí existe
        $closureData = $this->closureService->calculateClosure($activeShift);

        return Inertia::render('Empleados/Shifts/Close', [
            'closureData' => $closureData,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Shift $shift)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Shift $shift)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Shift $shift)
    {
        //
    }

    /**
     * Ejecuta el cierre definitivo de caja
     */
    public function storeClosure(Request $request)
    {
        $request->validate([
            'final_cash' => ['required', 'numeric', 'min:0'],
        ]);

        $activeShift = Shift::where('user_id', auth()->id())
            ->where('status', 'open')
            ->firstOrFail();

        // Calculamos cuánto debía tener vs lo que declaró para saber si hay faltante o sobrante
        $calculations = $this->closureService->calculateClosure($activeShift);
        $expectedCash = $calculations['expected_cash'];
        $difference = $request->final_cash - $expectedCash;

        // Cerramos el turno
        $this->closureService->closeShift($activeShift, $request->final_cash);

        return redirect()->route('dashboard')->with('success', 'Turno cerrado exitosamente. Diferencia en caja: $' . number_format($difference, 2));
    }
}
