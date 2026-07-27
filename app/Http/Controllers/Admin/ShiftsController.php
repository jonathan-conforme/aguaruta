<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Shift;
use Inertia\Inertia;
use App\Services\ShiftService;



class ShiftsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
     protected $shiftService;

    public function __construct(ShiftService $shiftService)
    {
        $this->shiftService = $shiftService;
    }

   public function index()
{

    return Inertia::render('Admin/Shifts/Index', [
        'shifts' => $this->shiftService->getAdminShifts()
    ]);

}
public function exportPdf(Request $request)
    {
        // 1. Delegas la lógica al Servicio
        $pdf = $this->shiftService->generatePdfReport($request->date);

        // 2. Retornas la descarga
        return $pdf->download('Reporte_General_Cajas_' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
