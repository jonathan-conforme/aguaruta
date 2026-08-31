<?php

namespace App\Http\Controllers\Empleados;

use App\Services\Empleados\ReceivableService;
use App\Http\Requests\StorePaymentRequest;
use Illuminate\Http\RedirectResponse;
use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\Sale;
use App\Models\Shift;
use Inertia\Inertia;

class ReceivableController extends Controller
{
    protected ReceivableService $receivableService;
    protected PaymentService $paymentService;

    public function __construct(
        ReceivableService $receivableService,
        PaymentService $paymentService
    ) {
        $this->receivableService = $receivableService;
        $this->paymentService = $paymentService;
    }

    /**
     * Carga la vista con las ventas pendientes.
     */
    public function index(Request $request): Response
{
    $data = $this->receivableService->getPendingSalesData(
        $request->user()->company_id,
        $request->input('search')
    );

    return Inertia::render('Empleados/Receivables/Index', [
        'sales'   => $data['sales'],
        'stats'   => $data['stats'],
        'filters' => $request->only(['search'])
    ]);
}

    /**
     * Carga la vista de historial de cobros del empleado.
     */
   public function history(Request $request): Response
    {
        $user = $request->user();
        $filters = $request->only(['search', 'payment_method', 'start_date', 'end_date']);

        if ($user->role === 'admin') {
            $data = $this->receivableService->getCompanyPaymentHistory(
                $user->company_id,
                $filters
            );
        } else {
            $data = $this->receivableService->getEmployeePaymentHistory(
                $user->id,
                $filters
            );
        }

        return Inertia::render('Empleados/Receivables/History', [
            'payments' => $data['payments'],
            'stats'    => $data['stats'],
            'filters'  => $filters
        ]);
    }
    /**
     * Procesa un abono usando el PaymentService.
     */
    public function storePayment(StorePaymentRequest $request, Sale $sale): RedirectResponse
    {
        $activeShift = Shift::where('user_id', auth()->id())
            ->where('status', 'open')
            ->first();

        if (!$activeShift) {
            return back()->withErrors([
                'shift' => 'Debes tener un turno de caja abierto para registrar cobranzas.'
            ]);
        }

        try {
            $this->paymentService->registerPayment($sale, array_merge(
                $request->validated(),
                ['shift_id' => $activeShift->id]
            ));

            return back()->with('success', 'Abono registrado con éxito.');
        } catch (\Exception $e) {
            return back()->withErrors(['amount' => $e->getMessage()]);
        }
    }
   

}
