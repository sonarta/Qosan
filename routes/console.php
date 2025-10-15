<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule auto-billing on 1st of every month at 00:00
Schedule::command('bills:generate-monthly')
    ->monthlyOn(1, '00:00')
    ->timezone('Asia/Jakarta');
