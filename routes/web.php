<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::resource('properties', \App\Http\Controllers\PropertyController::class);
    Route::resource('rooms', \App\Http\Controllers\RoomController::class);
    Route::patch('rooms/{room}/status', [\App\Http\Controllers\RoomController::class, 'updateStatus'])->name('rooms.update-status');
    
    Route::resource('tenants', \App\Http\Controllers\TenantController::class);
    Route::patch('tenants/{tenant}/check-out', [\App\Http\Controllers\TenantController::class, 'checkOut'])->name('tenants.check-out');
    
    Route::resource('bills', \App\Http\Controllers\BillController::class);
    Route::get('bills/{bill}/pdf', [\App\Http\Controllers\BillController::class, 'generatePdf'])->name('bills.pdf');
    Route::patch('bills/{bill}/mark-paid', [\App\Http\Controllers\BillController::class, 'markAsPaid'])->name('bills.mark-paid');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
