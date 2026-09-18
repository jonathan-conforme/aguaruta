<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
// Ejecutar el respaldo de la base de datos todos los días a las 02:00 AM

// 1. Limpia archivos viejos primero (01:30 AM)
Schedule::command('backup:clean')->dailyAt('01:30');
// 2. Genera el nuevo respaldo después (02:00 AM)
Schedule::command('backup:run --only-db')->dailyAt('02:00');
