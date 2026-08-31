<?php
namespace App\Services;

use App\Models\Payment;
use App\Models\Sale;
use Illuminate\Support\Facades\DB;
use Exception;

class PaymentService
{
    /**
     * Registra un abono o pago parcial/total a una venta existente.
     */
    public function registerPayment(Sale $sale, array $data): Payment
    {
        return DB::transaction(function () use ($sale, $data) {
            // 1. Validar estado de la venta
            if ($sale->status === 'paid' || $sale->balance_amount <= 0) {
                throw new Exception("La venta #{$sale->id} ya se encuentra cancelada en su totalidad.");
            }

            $amount = round($data['amount'], 2);

            // 2. Validar que el abono no supere la deuda actual
            if ($amount > $sale->balance_amount) {
                throw new Exception("El monto (${$amount}) supera el saldo pendiente del cliente (${$sale->balance_amount}).");
            }

            // 3. Registrar el pago asociado al turno activo del cobrador/repartidor
            $payment = Payment::create([
                'company_id'       => $sale->company_id,
                'sale_id'          => $sale->id,
                'customer_id'      => $sale->customer_id,
                'shift_id'         => $data['shift_id'], // Clave para cuadrar caja hoy
                'amount'           => $amount,
                'payment_method'   => $data['payment_method'], // cash | transfer
                'reference_number' => $data['reference_number'] ?? null,
                'notes'            => $data['notes'] ?? null,
            ]);

            // 4. Actualizar acumulados en la venta
            $newPaidAmount = round($sale->paid_amount + $amount, 2);
            $newBalance    = round($sale->total - $newPaidAmount, 2);

            $sale->update([
                'paid_amount'    => $newPaidAmount,
                'balance_amount' => $newBalance,
                'status'         => $newBalance <= 0 ? 'paid' : 'partial',
            ]);

            return $payment;
        });
    }
}