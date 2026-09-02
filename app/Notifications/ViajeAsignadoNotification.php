<?php

namespace App\Notifications;

use App\Models\Trip;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Carbon\Carbon;

class ViajeAsignadoNotification extends Notification
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
        $hora = $this->trip->created_at
            ? Carbon::parse($this->trip->created_at)->format('g:i A')
            : now()->format('g:i A');

        return [
            'company_id' => $this->trip->company_id,
            'title'      => 'Nuevo Viaje Asignado',
            'message'    => "Se te ha asignado el Despacho #{$this->trip->trip_number} a las {$hora}.",
            'time'       => $hora,
            'url'        => route('repartidor.trips.index'),
            'icon'       => 'TruckIcon',
        ];
    }
}
