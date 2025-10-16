<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Payment::with(['bill.tenant.room.property.owner']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('bill.tenant', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('bill.tenant.room.property.owner', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by payment method
        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'payment_date');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $payments = $query->paginate(15)->withQueryString();

        // Statistics
        $stats = [
            'total_payments' => Payment::count(),
            'confirmed' => Payment::where('status', 'confirmed')->count(),
            'pending' => Payment::where('status', 'pending')->count(),
            'rejected' => Payment::where('status', 'rejected')->count(),
            'total_amount' => Payment::where('status', 'confirmed')->sum('amount'),
        ];

        return Inertia::render('admin/payments/index', [
            'payments' => $payments,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'payment_method', 'sort_by', 'sort_order']),
        ]);
    }
}
