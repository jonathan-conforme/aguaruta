<?php

namespace App\Http\Controllers\Empleados;

use App\Services\ShiftClosureService;
use App\Http\Controllers\Controller;
use App\Services\ShiftService;
use Illuminate\Http\Request;
use App\Models\Shift;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Notifications\CierreCajaNotification;
use Illuminate\Support\Facades\Notification;
use App\Models\User;

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
       public function index(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate   = $request->query('end_date');

        if ($startDate && $endDate) {
            $start = Carbon::parse($startDate);
            $end   = Carbon::parse($endDate);

            if ($start->diffInDays($end) > 31) {
                $endDate = $start->copy()->addDays(31)->format('Y-m-d');
            }
        }

        // Pasamos el rango de fechas al servicio del empleado
        $data = $this->shiftService->getShiftsData($startDate, $endDate);


       return Inertia::render('Admin/Shifts/Index', [ // Revisa que sea la ruta correcta de tu vista JS
        'shifts'  => $data['shifts'],
        'userRole' => auth()->user()->role,
        'totals'  => $data['totals'],
        'filters' => [
            'start_date' => $startDate ?? '',
            'end_date'   => $endDate ?? '',
        ],
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
            return redirect()->route('repartidor.dashboard')
                ->with('info', 'No tienes un turno abierto actualmente para realizar el corte.');
        }

        // 3. El resto de tu código queda igual, ya que ahora sabemos que $activeShift sí existe
        $closureData = $this->closureService->calculateClosure($activeShift);

        return Inertia::render('Empleados/Shifts/Close', [
            'closureData' => $closureData,
        ]);
    }
    public function exportPdf(Request $request)
{
    // Capturamos las variables de fecha enviadas en la URL
    $startDate = $request->query('start_date');
    $endDate   = $request->query('end_date');

    // Enviamos ambas fechas al servicio
    $pdf = $this->shiftService->generatePdfReport($startDate, $endDate);

    return $pdf->download('Mis_Cajas_' . now()->format('Y-m-d') . '.pdf');
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
// Notificar a los administradores de la empresa
$admins = User::where('company_id', $activeShift->company_id)
    ->where('role', 'admin')
    ->get();

if ($admins->isNotEmpty()) {
    Notification::send($admins, new CierreCajaNotification($activeShift));
}
        return redirect()->route('repartidor.dashboard')
        ->with('success', 'Turno cerrado exitosamente. Diferencia en caja: $' . number_format($difference, 2));
    }
}
