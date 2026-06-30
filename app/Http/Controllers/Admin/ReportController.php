<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sale;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function downloadSalesReport(Request $request)
    {
        $companyId = auth()->user()->company_id;
        $range = $request->query('range', 'day'); // day, week, fortnight, month
        $dateInput = $request->query('date', Carbon::today()->toDateString());

        $referenceDate = Carbon::parse($dateInput);

        // Determinamos las fechas de inicio y fin según el rango seleccionado
        switch ($range) {
            case 'week':
                $startDate = $referenceDate->copy()->startOfWeek();
                $endDate = $referenceDate->copy()->endOfWeek();
                $filename = "Ventas_Semana_{$startDate->format('Y-m-d')}";
                break;
            case 'fortnight':
                if ($referenceDate->day <= 15) {
                    $startDate = $referenceDate->copy()->startOfMonth();
                    $endDate = $referenceDate->copy()->day(15)->endOfDay();
                } else {
                    $startDate = $referenceDate->copy()->day(16)->startOfDay();
                    $endDate = $referenceDate->copy()->endOfMonth();
                }
                $filename = "Ventas_Quincena_{$startDate->format('Y-m-d')}";
                break;
            case 'month':
                $startDate = $referenceDate->copy()->startOfMonth();
                $endDate = $referenceDate->copy()->endOfMonth();
                $filename = "Ventas_Mes_{$referenceDate->format('Y-m')}";
                break;
            case 'day':
            default:
                $startDate = $referenceDate->copy()->startOfDay();
                $endDate = $referenceDate->copy()->endOfDay();
                $filename = "Ventas_Diario_{$referenceDate->format('Y-m-d')}";
                break;
        }

        // Streaming de la respuesta (Perfecto para tu hosting actual)
        return response()->stream(function () use ($companyId, $startDate, $endDate) {
            $handle = fopen('php://output', 'w');

            // BOM para que Excel lea las tildes y caracteres latinos correctamente
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            // Encabezados del Excel
            fputcsv($handle, [
                'Fecha',
                'Hora',
                'Vendedor / Chofer',
                'Cliente',
                'Total ($)',
                'Envases Retornados',
                'Método de Pago'
            ]);

            // Consulta optimizada (Chunk para no llenar la RAM)
            Sale::where('company_id', $companyId)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->with(['user:id,name', 'customer:id,name'])
                ->orderBy('created_at', 'asc')
                ->chunk(200, function ($sales) use ($handle) {
                    foreach ($sales as $sale) {
                        fputcsv($handle, [
                            $sale->created_at->format('Y-m-d'),
                            $sale->created_at->format('H:i'),
                            $sale->user->name ?? 'N/A',
                            $sale->customer->name ?? 'Consumidor Final',
                            number_format($sale->total, 2, '.', ''),
                            $sale->returned_bottles ?? 0,
                            strtoupper($sale->payment_method ?? 'Efectivo')
                        ]);
                    }
                });

            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '.csv"',
        ]);
    }
}
