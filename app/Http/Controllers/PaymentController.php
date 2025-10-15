<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentStoreRequest;
use App\Models\Bill;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Payment::with(['bill.tenant.room.property', 'confirmedBy']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('start_date')) {
            $query->whereDate('payment_date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('payment_date', '<=', $request->end_date);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('payment_number', 'like', "%{$search}%")
                    ->orWhereHas('bill', function ($billQuery) use ($search) {
                        $billQuery->where('bill_number', 'like', "%{$search}%")
                            ->orWhereHas('tenant', function ($tenantQuery) use ($search) {
                                $tenantQuery->where('name', 'like', "%{$search}%");
                            });
                    });
            });
        }

        $payments = $query->orderByDesc('created_at')->paginate(10)->withQueryString();

        return Inertia::render('payments/index', [
            'payments' => $payments,
            'filters' => $request->only(['search', 'status', 'start_date', 'end_date']),
        ]);
    }

    public function pending(): Response
    {
        $pendingPayments = Payment::where('status', 'pending')
            ->with(['bill.tenant.room.property'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('payments/pending', [
            'pendingPayments' => $pendingPayments,
        ]);
    }

    public function store(PaymentStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();

        try {
            $data = $request->validated();
            $data['payment_number'] = Payment::generatePaymentNumber();
            $data['status'] = 'pending';

            if ($request->hasFile('proof_image')) {
                $file = $request->file('proof_image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('payments/proofs', $filename, 'public');
                $data['proof_image'] = $path;
            }

            Payment::create($data);

            DB::commit();

            return redirect()->route('bills.show', $data['bill_id'])
                ->with('success', 'Pembayaran berhasil disubmit dan menunggu konfirmasi.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan pembayaran: ' . $e->getMessage()]);
        }
    }

    public function confirm(Payment $payment): RedirectResponse
    {
        if ($payment->status === 'confirmed') {
            return back()->with('info', 'Pembayaran sudah dikonfirmasi sebelumnya.');
        }

        DB::transaction(function () use ($payment) {
            $payment->update([
                'status' => 'confirmed',
                'confirmed_at' => now(),
                'confirmed_by' => auth()->id(),
            ]);

            $payment->bill->update(['status' => 'paid']);
        });

        return back()->with('success', 'Pembayaran berhasil dikonfirmasi.');
    }

    public function reject(Request $request, Payment $payment): RedirectResponse
    {
        $validated = $request->validate([
            'notes' => ['required', 'string'],
        ]);

        $payment->update([
            'status' => 'rejected',
            'notes' => $validated['notes'],
        ]);

        return back()->with('success', 'Pembayaran telah ditolak.');
    }

    public function export(Request $request)
    {
        $query = Payment::with(['bill.tenant.room.property', 'confirmedBy']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('start_date')) {
            $query->whereDate('payment_date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('payment_date', '<=', $request->end_date);
        }

        $payments = $query->orderByDesc('payment_date')->get();
        $filename = 'payments_' . now()->format('Ymd_His') . '.csv';

        return response()->streamDownload(function () use ($payments) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'Payment Number',
                'Bill Number',
                'Tenant',
                'Amount',
                'Payment Date',
                'Method',
                'Status',
                'Confirmed At',
                'Confirmed By',
            ]);

            foreach ($payments as $payment) {
                fputcsv($handle, [
                    $payment->payment_number,
                    $payment->bill?->bill_number,
                    $payment->bill?->tenant?->name,
                    $payment->amount,
                    optional($payment->payment_date)->format('Y-m-d'),
                    $payment->payment_method,
                    $payment->status,
                    optional($payment->confirmed_at)->format('Y-m-d H:i'),
                    $payment->confirmedBy?->name,
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
