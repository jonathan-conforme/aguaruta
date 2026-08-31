<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Shift;
use Inertia\Inertia;
use App\Services\ShiftService;
use Carbon\Carbon;



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





public function index(Request $request, ShiftService $shiftService)
{
    $startDate = $request->query('start_date');
    $endDate   = $request->query('end_date');

    if ($startDate && $endDate) {
        $start = Carbon::parse($startDate);
        $end   = Carbon::parse($endDate);

        // Si sobrepasa los 31 días, recortamos endDate automáticamente a 31 días desde startDate
        if ($start->diffInDays($end) > 31) {
            $endDate = $start->copy()->addDays(31)->format('Y-m-d');
        }
    }

   $data = $this->shiftService->getShiftsData($startDate, $endDate);

    return Inertia::render('Admin/Shifts/Index', [
        'shifts'  => $data['shifts'],
        'totals'  => $data['totals'],
        'filters' => [
            'start_date' => $startDate ?? '',
            'end_date'   => $endDate ?? '',
        ],
    ]);
}

public function exportPdf(Request $request, ShiftService $shiftService)
{
    $startDate = $request->query('start_date');
    $endDate   = $request->query('end_date');

    // Generar PDF con el rango de fechas
    $pdf = $shiftService->generatePdfReport($startDate, $endDate);

    return $pdf->download( now()->format('Y-m-d') . 'Reporte_General_Cajas_'. '.pdf');
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
