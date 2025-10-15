<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\Payment;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class FinanceReportController extends Controller
{
    public function index(Request $request): Response
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->endOfMonth()->format('Y-m-d'));
        $propertyId = $request->input('property_id');

        // Total Revenue (Confirmed Payments)
        $totalRevenue = Payment::where('status', 'confirmed')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->when($propertyId, function ($query) use ($propertyId) {
                $query->whereHas('bill.tenant.room', function ($q) use ($propertyId) {
                    $q->where('property_id', $propertyId);
                });
            })
            ->sum('amount');

        // Total Outstanding (Unpaid + Overdue Bills)
        $totalOutstanding = Bill::whereIn('status', ['unpaid', 'overdue'])
            ->whereBetween('bill_date', [$startDate, $endDate])
            ->when($propertyId, function ($query) use ($propertyId) {
                $query->whereHas('tenant.room', function ($q) use ($propertyId) {
                    $q->where('property_id', $propertyId);
                });
            })
            ->sum('total');

        // Pending Payments
        $pendingPayments = Payment::where('status', 'pending')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->when($propertyId, function ($query) use ($propertyId) {
                $query->whereHas('bill.tenant.room', function ($q) use ($propertyId) {
                    $q->where('property_id', $propertyId);
                });
            })
            ->sum('amount');

        // Monthly Trend (Last 6 months)
        $monthlyTrend = $this->getMonthlyTrend($propertyId);

        // Revenue by Property
        $revenueByProperty = $this->getRevenueByProperty($startDate, $endDate);

        // Payment Status Distribution
        $paymentStatusDistribution = Payment::select('status', DB::raw('count(*) as count'), DB::raw('sum(amount) as total'))
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->when($propertyId, function ($query) use ($propertyId) {
                $query->whereHas('bill.tenant.room', function ($q) use ($propertyId) {
                    $q->where('property_id', $propertyId);
                });
            })
            ->groupBy('status')
            ->get();

        // Recent Transactions
        $recentTransactions = Payment::with(['bill.tenant.room.property'])
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->when($propertyId, function ($query) use ($propertyId) {
                $query->whereHas('bill.tenant.room', function ($q) use ($propertyId) {
                    $q->where('property_id', $propertyId);
                });
            })
            ->orderByDesc('payment_date')
            ->limit(10)
            ->get();

        // Get all properties for filter
        $properties = Property::where('status', 'active')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('finance/reports', [
            'summary' => [
                'total_revenue' => $totalRevenue,
                'total_outstanding' => $totalOutstanding,
                'pending_payments' => $pendingPayments,
                'collection_rate' => $totalRevenue + $totalOutstanding > 0 
                    ? round(($totalRevenue / ($totalRevenue + $totalOutstanding)) * 100, 2)
                    : 0,
            ],
            'monthlyTrend' => $monthlyTrend,
            'revenueByProperty' => $revenueByProperty,
            'paymentStatusDistribution' => $paymentStatusDistribution,
            'recentTransactions' => $recentTransactions,
            'properties' => $properties,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'property_id' => $propertyId,
            ],
        ]);
    }

    private function getMonthlyTrend($propertyId = null): array
    {
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $startOfMonth = $date->copy()->startOfMonth();
            $endOfMonth = $date->copy()->endOfMonth();

            $revenue = Payment::where('status', 'confirmed')
                ->whereBetween('payment_date', [$startOfMonth, $endOfMonth])
                ->when($propertyId, function ($query) use ($propertyId) {
                    $query->whereHas('bill.tenant.room', function ($q) use ($propertyId) {
                        $q->where('property_id', $propertyId);
                    });
                })
                ->sum('amount');

            $outstanding = Bill::whereIn('status', ['unpaid', 'overdue'])
                ->whereBetween('bill_date', [$startOfMonth, $endOfMonth])
                ->when($propertyId, function ($query) use ($propertyId) {
                    $query->whereHas('tenant.room', function ($q) use ($propertyId) {
                        $q->where('property_id', $propertyId);
                    });
                })
                ->sum('total');

            $months[] = [
                'month' => $date->format('M Y'),
                'revenue' => (float) $revenue,
                'outstanding' => (float) $outstanding,
            ];
        }

        return $months;
    }

    private function getRevenueByProperty(string $startDate, string $endDate): array
    {
        return Payment::select(
                'properties.name as property_name',
                DB::raw('sum(payments.amount) as total_revenue'),
                DB::raw('count(payments.id) as payment_count')
            )
            ->join('bills', 'payments.bill_id', '=', 'bills.id')
            ->join('tenants', 'bills.tenant_id', '=', 'tenants.id')
            ->join('rooms', 'tenants.room_id', '=', 'rooms.id')
            ->join('properties', 'rooms.property_id', '=', 'properties.id')
            ->where('payments.status', 'confirmed')
            ->whereBetween('payments.payment_date', [$startDate, $endDate])
            ->groupBy('properties.id', 'properties.name')
            ->orderByDesc('total_revenue')
            ->get()
            ->map(function ($item) {
                return [
                    'property_name' => $item->property_name,
                    'total_revenue' => (float) $item->total_revenue,
                    'payment_count' => $item->payment_count,
                ];
            })
            ->toArray();
    }
}
