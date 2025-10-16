<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RevenueReportController extends Controller
{
    public function index(Request $request): Response
    {
        $period = $request->input('period', 'monthly'); // monthly, quarterly, yearly
        $year = $request->input('year', now()->year);

        // Total Revenue Metrics
        $currentMonthRevenue = $this->getCurrentMonthRevenue();
        $lastMonthRevenue = $this->getLastMonthRevenue();
        $revenueGrowth = $lastMonthRevenue > 0 
            ? (($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 
            : 0;

        $yearToDateRevenue = $this->getYearToDateRevenue($year);
        $averageRevenuePerOwner = $this->getAverageRevenuePerOwner();

        // Revenue Breakdown by Subscription Plan
        $revenueByPlan = $this->getRevenueByPlan($year);

        // Monthly Revenue Trend (Last 12 months)
        $monthlyRevenueTrend = $this->getMonthlyRevenueTrend();

        // Top Revenue Generating Owners
        $topOwners = $this->getTopRevenueOwners(10);

        // Revenue by Payment Method
        $revenueByPaymentMethod = $this->getRevenueByPaymentMethod($year);

        // Quarterly Comparison
        $quarterlyComparison = $this->getQuarterlyComparison($year);

        return Inertia::render('admin/revenue-report', [
            'metrics' => [
                'current_month_revenue' => $currentMonthRevenue,
                'last_month_revenue' => $lastMonthRevenue,
                'revenue_growth' => round($revenueGrowth, 2),
                'year_to_date_revenue' => $yearToDateRevenue,
                'average_revenue_per_owner' => $averageRevenuePerOwner,
            ],
            'revenueByPlan' => $revenueByPlan,
            'monthlyRevenueTrend' => $monthlyRevenueTrend,
            'topOwners' => $topOwners,
            'revenueByPaymentMethod' => $revenueByPaymentMethod,
            'quarterlyComparison' => $quarterlyComparison,
            'filters' => [
                'period' => $period,
                'year' => $year,
            ],
        ]);
    }

    private function getCurrentMonthRevenue(): float
    {
        return Payment::where('status', 'confirmed')
            ->whereYear('payment_date', now()->year)
            ->whereMonth('payment_date', now()->month)
            ->sum('amount');
    }

    private function getLastMonthRevenue(): float
    {
        $lastMonth = now()->subMonth();
        return Payment::where('status', 'confirmed')
            ->whereYear('payment_date', $lastMonth->year)
            ->whereMonth('payment_date', $lastMonth->month)
            ->sum('amount');
    }

    private function getYearToDateRevenue(int $year): float
    {
        return Payment::where('status', 'confirmed')
            ->whereYear('payment_date', $year)
            ->sum('amount');
    }

    private function getAverageRevenuePerOwner(): float
    {
        $totalOwners = User::where('role', 'owner')
            ->where('status', 'active')
            ->count();

        if ($totalOwners === 0) {
            return 0;
        }

        $totalRevenue = Payment::where('status', 'confirmed')
            ->whereYear('payment_date', now()->year)
            ->sum('amount');

        return $totalRevenue / $totalOwners;
    }

    private function getRevenueByPlan(int $year): array
    {
        return Payment::select(
                'subscriptions.plan_name',
                DB::raw('sum(payments.amount) as total_revenue'),
                DB::raw('count(distinct payments.bill_id) as transaction_count')
            )
            ->join('bills', 'payments.bill_id', '=', 'bills.id')
            ->join('tenants', 'bills.tenant_id', '=', 'tenants.id')
            ->join('rooms', 'tenants.room_id', '=', 'rooms.id')
            ->join('properties', 'rooms.property_id', '=', 'properties.id')
            ->join('users', 'properties.owner_id', '=', 'users.id')
            ->join('subscriptions', function($join) {
                $join->on('users.id', '=', 'subscriptions.user_id')
                     ->where('subscriptions.status', 'active');
            })
            ->where('payments.status', 'confirmed')
            ->whereYear('payments.payment_date', $year)
            ->groupBy('subscriptions.plan_name')
            ->get()
            ->map(function ($item) {
                return [
                    'plan_name' => ucfirst($item->plan_name),
                    'total_revenue' => (float) $item->total_revenue,
                    'transaction_count' => $item->transaction_count,
                ];
            })
            ->toArray();
    }

    private function getMonthlyRevenueTrend(): array
    {
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            
            $revenue = Payment::where('status', 'confirmed')
                ->whereYear('payment_date', $date->year)
                ->whereMonth('payment_date', $date->month)
                ->sum('amount');

            $months[] = [
                'month' => $date->format('M Y'),
                'revenue' => (float) $revenue,
            ];
        }

        return $months;
    }

    private function getTopRevenueOwners(int $limit = 10): array
    {
        return User::select(
                'users.id',
                'users.name',
                'users.email',
                DB::raw('sum(payments.amount) as total_revenue'),
                DB::raw('count(distinct payments.id) as payment_count'),
                DB::raw('count(distinct properties.id) as property_count')
            )
            ->join('properties', 'users.id', '=', 'properties.owner_id')
            ->join('rooms', 'properties.id', '=', 'rooms.property_id')
            ->join('tenants', 'rooms.id', '=', 'tenants.room_id')
            ->join('bills', 'tenants.id', '=', 'bills.tenant_id')
            ->join('payments', 'bills.id', '=', 'payments.bill_id')
            ->where('users.role', 'owner')
            ->where('payments.status', 'confirmed')
            ->whereYear('payments.payment_date', now()->year)
            ->groupBy('users.id', 'users.name', 'users.email')
            ->orderByDesc('total_revenue')
            ->limit($limit)
            ->get()
            ->map(function ($owner) {
                return [
                    'id' => $owner->id,
                    'name' => $owner->name,
                    'email' => $owner->email,
                    'total_revenue' => (float) $owner->total_revenue,
                    'payment_count' => $owner->payment_count,
                    'property_count' => $owner->property_count,
                ];
            })
            ->toArray();
    }

    private function getRevenueByPaymentMethod(int $year): array
    {
        return Payment::select(
                'payment_method',
                DB::raw('sum(amount) as total_revenue'),
                DB::raw('count(*) as transaction_count')
            )
            ->where('status', 'confirmed')
            ->whereYear('payment_date', $year)
            ->whereNotNull('payment_method')
            ->groupBy('payment_method')
            ->orderByDesc('total_revenue')
            ->get()
            ->map(function ($item) {
                return [
                    'method' => $item->payment_method ?? 'Unknown',
                    'total_revenue' => (float) $item->total_revenue,
                    'transaction_count' => $item->transaction_count,
                ];
            })
            ->toArray();
    }

    private function getQuarterlyComparison(int $year): array
    {
        $quarters = [];
        
        for ($q = 1; $q <= 4; $q++) {
            $startMonth = ($q - 1) * 3 + 1;
            $endMonth = $q * 3;
            
            $revenue = Payment::where('status', 'confirmed')
                ->whereYear('payment_date', $year)
                ->whereRaw("CAST(strftime('%m', payment_date) AS INTEGER) BETWEEN ? AND ?", [$startMonth, $endMonth])
                ->sum('amount');

            $quarters[] = [
                'quarter' => "Q{$q} {$year}",
                'revenue' => (float) $revenue,
            ];
        }

        return $quarters;
    }
}
