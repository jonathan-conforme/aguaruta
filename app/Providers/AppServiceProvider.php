<?php

namespace App\Providers;

use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Spatie\Backup\Events\BackupWasSuccessful;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Escuchar cuando el respaldo de Spatie finaliza con éxito
        Event::listen(BackupWasSuccessful::class, function () {
            $token = env('TELEGRAM_BOT_TOKEN');
            $chatId = env('TELEGRAM_CHAT_ID');
            $appName = config('app.name', 'AquaRuta');

            if ($token && $chatId) {
                Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
                    'chat_id' => $chatId,
                    'text' => "✅ *Respaldo Exitoso - {$appName}*\n\n" .
                              "📅 *Fecha:* " . now()->format('Y-m-d H:i:s') . "\n" .
                              "📦 La copia de seguridad se ha generado y guardado correctamente.",
                    'parse_mode' => 'Markdown',
                ]);
            }
        });
    }
}
