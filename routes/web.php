<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('properties', \App\Http\Controllers\PropertyController::class);
    Route::resource('rooms', \App\Http\Controllers\RoomController::class);
    Route::patch('rooms/{room}/status', [\App\Http\Controllers\RoomController::class, 'updateStatus'])->name('rooms.update-status');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
