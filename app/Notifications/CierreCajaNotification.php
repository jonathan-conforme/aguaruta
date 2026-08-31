<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Carbon\Carbon;


class CierreCajaNotification extends Notification
{
    use Queueable;

    public $shift;

    /**
     * Create a new notification instance.
     */
    public function __construct($shift)
    {
       $this->shift = $shift;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable): array
    {
        $employeeName = $this->shift->user->name ?? 'Empleado';

       // Obtener y formatear la hora (ejemplo: 03:45 PM)
        $closedTime = isset($this->shift->closed_at)
            ? Carbon::parse($this->shift->closed_at)->format('g:i A')
            : ($this->shift->updated_at ? $this->shift->updated_at->format('g:i A') : now()->format('g:i A'));

        return [
            'company_id' => $this->shift->company_id,
            'title'      => 'Cierre de Caja Registrado',
            'message'    => "{$employeeName} realizó el cierre a las {$closedTime} con un monto de \${$this->shift->final_cash}.",
            'time'       => $closedTime,
            'url'        => route('admin.shifts.index'),
            'icon'       => 'LockClosedIcon',
        ];
}
}
