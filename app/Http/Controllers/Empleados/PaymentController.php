<?php
namespace App\Http\Controllers\Empleados;

use App\Http\Requests\StorePaymentRequest;
use App\Models\Sale;
use App\Services\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PaymentController extends Controller
{
    protected PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Registra un abono recibido a una venta a crédito.
     */
    public function store(StorePaymentRequest $request, Sale $sale): RedirectResponse
    {
        try {
            // Asume que el usuario tiene un shift_id activo en sesión o en su relación
            $activeShiftId = $request->user()->active_shift_id ?? $sale->shift_id;

            $this->paymentService->registerPayment($sale, array_merge(
                $request->validated(),
                ['shift_id' => $activeShiftId]
            ));

            return redirect()->back()->with('success', 'Abono registrado con éxito.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['amount' => $e->getMessage()]);
        }
    }
}