<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use NotificationChannels\Telegram\TelegramMessage;

class BackupSuccessfulTelegramNotification extends Notification
{
    use Queueable;

    public function via($notifiable)
    {
        return ['telegram'];
    }

    public function toTelegram($notifiable)
    {
        $appName = config('app.name', 'AquaRutaTech');

        return TelegramMessage::create()
            ->to(env('TELEGRAM_CHAT_ID'))
            ->content("✅ *Respaldo Exitoso - {$appName}*\n\n" .
                      "📅 *Fecha:* " . now()->format('Y-m-d H:i:s') . "\n" .
                      "📦 La copia de seguridad de la base de datos se ha generado y almacenado correctamente.");
    }
}
