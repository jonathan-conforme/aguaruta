<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use NotificationChannels\Telegram\TelegramMessage;

class CleanupSuccessfulTelegramNotification extends Notification
{
    use Queueable;

    public function via($notifiable)
    {
        return ['telegram'];
    }

    public function toTelegram($notifiable)
    {
        $appName = config('app.name', 'AquaRuta');

        return TelegramMessage::create()
            ->to(env('TELEGRAM_CHAT_ID'))
            ->content("🧹 *Limpieza de Respaldo Completada - {$appName}*\n\n" .
                      "📅 *Fecha:* " . now()->format('Y-m-d H:i:s') . "\n" .
                      "🗑️ Se han eliminado los respaldos antiguos según la política establecida.");
    }
}
