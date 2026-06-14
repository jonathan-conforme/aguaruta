<?php

namespace App\Http\Controllers\Empleados;

use App\Http\Controllers\Controller;
use App\Services\ExpenseService;
use Illuminate\Http\Request;
use App\Models\Shift;
use App\Models\Trip;
use Inertia\Inertia;

class ExpenseController extends Controller

{
    protected $expenseService;

    public function __construct(ExpenseService $expenseService)
    {
        $this->expenseService = $expenseService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
{
    $shift = Shift::where('user_id', auth()->id())
        ->where('status', 'open')
        ->first();

    if (!$shift) {
        return redirect()->route('repartidor.trips.index')
            ->with('info', 'Debes abrir caja antes de registrar gastos.');
    }

    return Inertia::render('Empleados/Expenses/Create', [
        'shift' => $shift
    ]);
}


    /**
     * Store a newly created resource in storage.
     */
  public function store(Request $request)
    {
        $request->validate([
            'shift_id' => ['required', 'exists:shifts,id'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'category' => ['required', 'in:fuel,toll,repair,food,other'],
            'description' => ['nullable', 'string'],
        ]);

        try {
            $this->expenseService->create($request->all());

            return back()->with('success', 'Gasto registrado correctamente');

        } catch (\Exception $e) {
            return back()->with('error', 'Error al registrar gasto: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Expense $expense)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Expense $expense)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Expense $expense)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        //
    }
}
