<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Property;
use App\Models\Room;
use App\Models\Tenant;
use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Key Metrics
        $totalOwners = User::where('role', 'owner')->count();
        $activeOwners = User::where('role', 'owner')
            ->whereHas('subscription', function ($query) {
                $query->where('status', 'active');
            })
            ->count();
        
        $totalProperties = Property::count();
        $totalRooms = Room::count();
        $occupiedRooms = Room::where('status', 'occupied')->count();
        $occupancyRate = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100, 2) : 0;

        // Revenue Metrics
        $currentMonthRevenue = Payment::where('status', 'confirmed')
            ->whereMonth('payment_date', now()->month)
            ->whereYear('payment_date', now()->year)
            ->sum('amount');

        $lastMonthRevenue = Payment::where('status', 'confirmed')
            ->whereMonth('payment_date', now()->subMonth()->month)
            ->whereYear('payment_date', now()->subMonth()->year)
            ->sum('amount');

        $revenueGrowth = $lastMonthRevenue > 0 
            ? round((($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 2)
            : 0;

        // Subscription Distribution
        $subscriptionDistribution = Subscription::select('plan_name', DB::raw('count(*) as count'))
            ->where('status', 'active')
            ->groupBy('plan_name')
            ->get()
            ->map(function ($item) {
                return [
                    'plan' => ucfirst($item->plan_name),
                    'count' => $item->count,
                ];
            });

        // Monthly Revenue Trend (Last 6 months)
        $monthlyRevenue = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $revenue = Payment::where('status', 'confirmed')
                ->whereMonth('payment_date', $date->month)
                ->whereYear('payment_date', $date->year)
                ->sum('amount');

            $monthlyRevenue[] = [
                'month' => $date->format('M Y'),
                'revenue' => (float) $revenue,
            ];
        }

        // User Growth Trend (Last 6 months)
        $userGrowth = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $count = User::where('role', 'owner')
                ->whereYear('created_at', '<=', $date->year)
                ->whereMonth('created_at', '<=', $date->month)
                ->count();

            $userGrowth[] = [
                'month' => $date->format('M Y'),
                'users' => $count,
            ];
        }

        // Recent Activities
        $recentOwners = User::where('role', 'owner')
            ->with('subscription')
            ->latest()
            ->limit(5)
            ->get();

        $recentPayments = Payment::with(['bill.tenant.room.property'])
            ->where('status', 'confirmed')
            ->latest('payment_date')
            ->limit(5)
            ->get();

        // Top Performing Owners (by revenue)
        $topOwners = Payment::select(
                'users.id',
                'users.name',
                'users.email',
                DB::raw('sum(payments.amount) as total_revenue'),
                DB::raw('count(payments.id) as payment_count')
            )
            ->join('bills', 'payments.bill_id', '=', 'bills.id')
            ->join('tenants', 'bills.tenant_id', '=', 'tenants.id')
            ->join('rooms', 'tenants.room_id', '=', 'rooms.id')
            ->join('properties', 'rooms.property_id', '=', 'properties.id')
            ->join('users', 'properties.owner_id', '=', 'users.id')
            ->where('payments.status', 'confirmed')
            ->groupBy('users.id', 'users.name', 'users.email')
            ->orderByDesc('total_revenue')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'email' => $item->email,
                    'total_revenue' => (float) $item->total_revenue,
                    'payment_count' => $item->payment_count,
                ];
            });

        return Inertia::render('admin/dashboard', [
            'metrics' => [
                'total_owners' => $totalOwners,
                'active_owners' => $activeOwners,
                'total_properties' => $totalProperties,
                'total_rooms' => $totalRooms,
                'occupancy_rate' => $occupancyRate,
                'current_month_revenue' => $currentMonthRevenue,
                'revenue_growth' => $revenueGrowth,
            ],
            'subscriptionDistribution' => $subscriptionDistribution,
            'monthlyRevenue' => $monthlyRevenue,
            'userGrowth' => $userGrowth,
            'recentOwners' => $recentOwners,
            'recentPayments' => $recentPayments,
            'topOwners' => $topOwners,
        ]);
    }
}
