<?php

namespace App\Notifications;

use App\Models\Trip;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ViajeIniciadoNotification extends Notification
{
    use Queueable;

    protected $trip;

    public function __construct(Trip $trip)
    {
        $this->trip = $trip;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        $hora = now()->format('g:i A');
        $repartidor = auth()->user()->name ?? 'El repartidor';

        return [
            'company_id' => $this->trip->company_id,
            'title'      => 'Viaje Iniciado/Revisado',
            'message'    => "{$repartidor} inició y revisó el Despacho #{$this->trip->trip_number} a las {$hora}.",
            'time'       => $hora,
            'url'        => route('trips.index'),
            'icon'       => 'ClipboardDocumentCheckIcon',
        ];
    }
}
