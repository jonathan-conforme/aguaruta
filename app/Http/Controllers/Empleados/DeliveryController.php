<?php

namespace App\Http\Controllers\Empleados;

use App\Notifications\ViajeIniciadoNotification;
use App\Http\Controllers\Controller;
use App\Services\TripService;
use Illuminate\Http\Request;
Use App\Models\Shift;
use App\Models\Trip;
use App\Models\User;
use Inertia\Inertia;

class DeliveryController extends Controller
{
    protected $tripService;

    public function __construct(TripService $tripService)
    {
        $this->tripService = $tripService;
    }

    /**
     * Muestra la lista de viajes del día para el empleado (repartidor)
     */
    public function index()
    {
        $user = auth()->user();

        // Tu Global Scope ya filtra por la empresa correcta.
        // Solo traemos los viajes donde este usuario está asignado.
        $trips = Trip::with(['route', 'products']) // Usamos los nombres de relaciones que me mostraste
            ->where(function ($query) use ($user) {
                $query->where('seller_id', $user->id)
                      ->orWhere('driver_id', $user->id);
            })
            ->whereIn('status', ['pending', 'active'])
            ->orderBy('date', 'desc')
            ->get();

        // Asegúrate de crear este archivo en resources/js/Pages/Empleados/Trips/Index.jsx
        return Inertia::render('Empleados/Trips/Index', [
            'trips' => $trips
        ]);
    }

   /**
     * Cambia el estado del viaje de "pending" a "active" y asigna la caja
     */
    public function start(Request $request, Trip $trip)
{
    $user = auth()->user();

    // 1. Verificar permisos (si es vendedor o chofer asignado)
    if ($trip->seller_id !== $user->id && $trip->driver_id !== $user->id) {
        abort(403, 'No tienes permiso para iniciar este viaje.');
    }

    // 2. Buscar caja abierta del usuario CONECTADO (no de $trip->seller_id)
    $activeShift = Shift::where('user_id', $user->id)
        ->where('status', 'open')
        ->first();

    // Si realmente no tiene caja abierta, lo enviamos a abrirla
    if (!$activeShift) {
        return redirect()->route('repartidor.shifts.create')
            ->with('info', 'Debes abrir caja antes de iniciar el viaje.');
    }

    // 3. Activar el viaje y enlazar el shift_id
    $this->tripService->startTrip(
            $trip->id,
            (float) $activeShift->initial_cash,
            (int) $activeShift->id
        );

    return back();

    // 4. Redirigir directamente al POS / Formulario de Ventas
    return redirect()
        ->route('repartidor.sales.create', $trip->id)
        ->with('success', '¡la Ruta se ha iniciado correctamente!');
}
    /**
     * Cambia el estado del viaje a "completed" (Cerrar viaje)
     */
    public function complete(Request $request, Trip $trip)
    {
        $user = auth()->user();

        // Seguridad: Verificar que el empleado no intente cerrar el viaje de otro
        if ($trip->seller_id !== $user->id && $trip->driver_id !== $user->id) {
            abort(403, 'No tienes permiso para cerrar este viaje.');
        }

        // Cambiar el estado si está activo
        if ($trip->status === 'active') {
            $trip->update(['status' => 'completed']); // Asegúrate de que 'completed' sea el estado correcto en tu BD
        }

        return back()->with('success', '¡El Viaje fue cerrado correctamente!');
    }

}
