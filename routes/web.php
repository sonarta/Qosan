<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dynamic dashboard based on role
    Route::get('dashboard', function () {
        if (auth()->user()->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }
        return app(\App\Http\Controllers\DashboardController::class)->index();
    })->name('dashboard');

    // Admin Routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
        
        // Owner Management
        Route::resource('owners', \App\Http\Controllers\Admin\OwnerController::class);
        Route::patch('owners/{owner}/suspend', [\App\Http\Controllers\Admin\OwnerController::class, 'suspend'])->name('owners.suspend');
        Route::patch('owners/{owner}/activate', [\App\Http\Controllers\Admin\OwnerController::class, 'activate'])->name('owners.activate');
        Route::patch('owners/{owner}/change-subscription', [\App\Http\Controllers\Admin\OwnerController::class, 'changeSubscription'])->name('owners.change-subscription');
        
        // Properties (Read-only)
        Route::get('properties', [\App\Http\Controllers\Admin\PropertyController::class, 'index'])->name('properties.index');
        Route::get('properties/{property}', [\App\Http\Controllers\Admin\PropertyController::class, 'show'])->name('properties.show');
        
        // Tenants (Read-only)
        Route::get('tenants', [\App\Http\Controllers\Admin\TenantController::class, 'index'])->name('tenants.index');
        Route::get('tenants/{tenant}', [\App\Http\Controllers\Admin\TenantController::class, 'show'])->name('tenants.show');
    });

    Route::resource('properties', \App\Http\Controllers\PropertyController::class);
    Route::resource('rooms', \App\Http\Controllers\RoomController::class);
    Route::patch('rooms/{room}/status', [\App\Http\Controllers\RoomController::class, 'updateStatus'])->name('rooms.update-status');
    
    Route::resource('tenants', \App\Http\Controllers\TenantController::class);
    Route::patch('tenants/{tenant}/check-out', [\App\Http\Controllers\TenantController::class, 'checkOut'])->name('tenants.check-out');
    
    Route::resource('bills', \App\Http\Controllers\BillController::class);
    Route::get('bills/{bill}/pdf', [\App\Http\Controllers\BillController::class, 'generatePdf'])->name('bills.pdf');
    Route::patch('bills/{bill}/mark-paid', [\App\Http\Controllers\BillController::class, 'markAsPaid'])->name('bills.mark-paid');
    
    Route::get('payments', [\App\Http\Controllers\PaymentController::class, 'index'])->name('payments.index');
    Route::post('payments', [\App\Http\Controllers\PaymentController::class, 'store'])->name('payments.store');
    Route::get('payments/pending/list', [\App\Http\Controllers\PaymentController::class, 'pending'])->name('payments.pending');
    Route::get('payments/export/csv', [\App\Http\Controllers\PaymentController::class, 'export'])->name('payments.export');
    Route::patch('payments/{payment}/confirm', [\App\Http\Controllers\PaymentController::class, 'confirm'])->name('payments.confirm');
    Route::patch('payments/{payment}/reject', [\App\Http\Controllers\PaymentController::class, 'reject'])->name('payments.reject');
    
    Route::get('finance/reports', [\App\Http\Controllers\FinanceReportController::class, 'index'])->name('finance.reports');
    
    Route::get('subscription', [\App\Http\Controllers\SubscriptionController::class, 'index'])->name('subscription.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
