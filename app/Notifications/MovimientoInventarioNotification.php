<?php

namespace App\Notifications;

use App\Models\InventoryMovement;
use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Carbon\Carbon;

class MovimientoInventarioNotification extends Notification
{
    use Queueable;

    protected $movement;
    protected $product;

    public function __construct(InventoryMovement $movement, Product $product)
    {
        $this->movement = $movement;
        $this->product = $product;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        $tipos = [
            'in' => 'Entrada de Stock',
            'out' => 'Salida de Stock',
            'packaging' => 'Envasado de Producto',
        ];

        $tipoTexto = $tipos[$this->movement->type] ?? 'Movimiento';
        $hora = $this->movement->created_at
            ? Carbon::parse($this->movement->created_at)->format('g:i A')
            : now()->format('g:i A');

        return [
            'company_id' => $this->movement->company_id,
            'title'      => "{$tipoTexto}",
            'message'    => "Se procesaron {$this->movement->quantity} unidades de {$this->product->name} a las {$hora}. Stock disponible: {$this->product->current_stock}.",
            'time'       => 'hora',
            'url'        => route('inventory-movements.index'),
            'icon'       => 'ArrowsRightLeftIcon',
        ];
    }
}
