<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTripRequest;
use App\Models\DeliveryRoute;
use App\Models\Product;
use App\Models\Trip;
use App\Models\User;
use App\Services\TripService;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class TripController extends Controller
{
    protected $tripService;

    public function __construct(TripService $tripService)
    {
        $this->tripService = $tripService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $trip = $this->tripService->getAllTrips();

        $users = User::where('company_id', auth()->user()->company_id)
            ->whereNotIn('role', ['admin', 'administrador'])
            ->where('is_active', true)
            ->get();
        $products = Product::where('is_active', true)->get();
        $routes = DeliveryRoute::where('is_active', true)->get();

        return Inertia::render('Admin/Trips/Index', [
            'trips' => $trip,
            'users' => $users,
            'products' => $products,
            'routes' => $routes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return redirect()->route('dispatches.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTripRequest $request)
    {

        $this->tripService->createTrip($request->validated());

        return redirect()->route('trips.index')
            ->with('success', 'Viaje creado y camión cargado exitosamente.');

    }

    /**
     * Display the specified resource.
     */
    public function show(Trip $trip)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Trip $trip)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    /**
     * Update the specified resource in storage.
     */
    public function update(StoreTripRequest $request, Trip $trip)
    {
        try {
            // Verificamos de nuevo que nadie intente editar por la fuerza un viaje ya iniciado
            if ($trip->status !== 'pending') {
                return back()->withErrors(['error' => 'No puedes editar un viaje que ya está en ruta o completado.']);
            }

            // Llamamos a nuestro nuevo servicio de actualización pasándole la data validada
            $this->tripService->updateTrip($trip, $request->validated());

            return redirect()->route('trips.index') // Asegúrate de que esta sea tu ruta correcta
                ->with('success', 'Viaje actualizado y carga recalculada exitosamente.');

        } catch (ValidationException $e) {
            $errorMessage = collect($e->errors())->flatten()->first();

            return back()->with('error', $errorMessage);

        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Trip $trip)
    {
        //
    }
}
