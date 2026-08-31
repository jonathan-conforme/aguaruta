<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Carbon\Carbon;

class NuevoAbonoNotification extends Notification
{
    use Queueable;

    protected $monto;
    protected $cliente;

    public function __construct($monto, $cliente)
    {
        $this->monto = $monto;
        $this->cliente = $cliente;
    }

    // MVP 1: Definimos que irá a la base de datos
    public function via($notifiable)
    {
        return ['database'];
    }

    // Datos que se convertirán a JSON dentro de la columna 'data'
    public function toArray($notifiable)
    {

           $hora = now()->format('g:i A');

        return [
            'title'   => 'Nuevo Abono Recibido',
            'message' => "{$this->cliente} registró un abono de \${$this->monto} a las {$hora}.",
            'time'    => 'hora',
            'url'     => route('admin.receivables.history'),
            'icon'    => 'BanknotesIcon',
        ];
    }
}
