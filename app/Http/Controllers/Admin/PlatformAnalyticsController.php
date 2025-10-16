<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\Payment;
use App\Models\Property;
use App\Models\Room;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PlatformAnalyticsController extends Controller
{
    public function index(Request $request): Response
    {
        // Platform Overview Metrics
        $platformMetrics = [
            'total_users' => User::count(),
            'total_owners' => User::where('role', 'owner')->count(),
            'active_owners' => User::where('role', 'owner')->where('status', 'active')->count(),
            'total_properties' => Property::count(),
            'active_properties' => Property::where('status', 'active')->count(),
            'total_rooms' => Room::count(),
            'occupied_rooms' => Room::where('status', 'occupied')->count(),
            'total_tenants' => Tenant::count(),
            'active_tenants' => Tenant::where('is_active', true)->count(),
        ];

        // Calculate occupancy rate
        $platformMetrics['occupancy_rate'] = $platformMetrics['total_rooms'] > 0
            ? round(($platformMetrics['occupied_rooms'] / $platformMetrics['total_rooms']) * 100, 2)
            : 0;

        // User Growth Trend (Last 12 months)
        $userGrowthTrend = $this->getUserGrowthTrend();

        // Property Growth Trend
        $propertyGrowthTrend = $this->getPropertyGrowthTrend();

        // Subscription Distribution
        $subscriptionDistribution = $this->getSubscriptionDistribution();

        // Active Subscriptions Trend
        $subscriptionTrend = $this->getSubscriptionTrend();

        // Platform Activity Metrics
        $activityMetrics = [
            'bills_generated_this_month' => Bill::whereYear('bill_date', now()->year)
                ->whereMonth('bill_date', now()->month)
                ->count(),
            'payments_this_month' => Payment::whereYear('payment_date', now()->year)
                ->whereMonth('payment_date', now()->month)
                ->count(),
            'new_tenants_this_month' => Tenant::whereYear('created_at', now()->year)
                ->whereMonth('created_at', now()->month)
                ->count(),
            'new_properties_this_month' => Property::whereYear('created_at', now()->year)
                ->whereMonth('created_at', now()->month)
                ->count(),
        ];

        // Geographic Distribution (by city)
        $geographicDistribution = $this->getGeographicDistribution();

        // Room Type Distribution
        $roomTypeDistribution = $this->getRoomTypeDistribution();

        // Average Metrics
        $averageMetrics = [
            'avg_rooms_per_property' => Property::count() > 0
                ? round(Room::count() / Property::count(), 2)
                : 0,
            'avg_price_per_room' => Room::avg('price') ?? 0,
            'avg_occupancy_duration' => $this->getAverageOccupancyDuration(),
        ];

        // Payment Success Rate
        $paymentMetrics = $this->getPaymentMetrics();

        return Inertia::render('admin/platform-analytics', [
            'platformMetrics' => $platformMetrics,
            'userGrowthTrend' => $userGrowthTrend,
            'propertyGrowthTrend' => $propertyGrowthTrend,
            'subscriptionDistribution' => $subscriptionDistribution,
            'subscriptionTrend' => $subscriptionTrend,
            'activityMetrics' => $activityMetrics,
            'geographicDistribution' => $geographicDistribution,
            'roomTypeDistribution' => $roomTypeDistribution,
            'averageMetrics' => $averageMetrics,
            'paymentMetrics' => $paymentMetrics,
        ]);
    }

    private function getUserGrowthTrend(): array
    {
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            
            $totalUsers = User::where('created_at', '<=', $date->endOfMonth())
                ->count();
            
            $newUsers = User::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();

            $months[] = [
                'month' => $date->format('M Y'),
                'total_users' => $totalUsers,
                'new_users' => $newUsers,
            ];
        }

        return $months;
    }

    private function getPropertyGrowthTrend(): array
    {
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            
            $totalProperties = Property::where('created_at', '<=', $date->endOfMonth())
                ->count();
            
            $newProperties = Property::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();

            $months[] = [
                'month' => $date->format('M Y'),
                'total_properties' => $totalProperties,
                'new_properties' => $newProperties,
            ];
        }

        return $months;
    }

    private function getSubscriptionDistribution(): array
    {
        return Subscription::select(
                'plan_name',
                DB::raw('count(*) as count')
            )
            ->where('status', 'active')
            ->groupBy('plan_name')
            ->get()
            ->map(function ($item) {
                return [
                    'plan' => ucfirst($item->plan_name),
                    'count' => $item->count,
                ];
            })
            ->toArray();
    }

    private function getSubscriptionTrend(): array
    {
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            
            $activeSubscriptions = Subscription::where('status', 'active')
                ->where('start_date', '<=', $date->endOfMonth())
                ->where(function($query) use ($date) {
                    $query->whereNull('end_date')
                        ->orWhere('end_date', '>=', $date->startOfMonth());
                })
                ->count();

            $months[] = [
                'month' => $date->format('M Y'),
                'active_subscriptions' => $activeSubscriptions,
            ];
        }

        return $months;
    }

    private function getGeographicDistribution(): array
    {
        return Property::select(
                'city',
                DB::raw('count(*) as property_count'),
                DB::raw('sum((select count(*) from rooms where rooms.property_id = properties.id)) as room_count')
            )
            ->groupBy('city')
            ->orderByDesc('property_count')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'city' => $item->city,
                    'property_count' => $item->property_count,
                    'room_count' => $item->room_count ?? 0,
                ];
            })
            ->toArray();
    }

    private function getRoomTypeDistribution(): array
    {
        return Room::select(
                'type',
                DB::raw('count(*) as count'),
                DB::raw('avg(price) as avg_price')
            )
            ->whereNotNull('type')
            ->groupBy('type')
            ->orderByDesc('count')
            ->get()
            ->map(function ($item) {
                return [
                    'type' => $item->type,
                    'count' => $item->count,
                    'avg_price' => (float) $item->avg_price,
                ];
            })
            ->toArray();
    }

    private function getAverageOccupancyDuration(): float
    {
        $tenants = Tenant::where('is_active', true)
            ->get();

        if ($tenants->isEmpty()) {
            return 0;
        }

        $totalDays = 0;
        foreach ($tenants as $tenant) {
            $checkInDate = \Carbon\Carbon::parse($tenant->check_in_date);
            $totalDays += $checkInDate->diffInDays(now());
        }

        return round($totalDays / $tenants->count(), 2);
    }

    private function getPaymentMetrics(): array
    {
        $totalPayments = Payment::count();
        $confirmedPayments = Payment::where('status', 'confirmed')->count();
        $pendingPayments = Payment::where('status', 'pending')->count();
        $rejectedPayments = Payment::where('status', 'rejected')->count();

        return [
            'total_payments' => $totalPayments,
            'confirmed_payments' => $confirmedPayments,
            'pending_payments' => $pendingPayments,
            'rejected_payments' => $rejectedPayments,
            'success_rate' => $totalPayments > 0
                ? round(($confirmedPayments / $totalPayments) * 100, 2)
                : 0,
        ];
    }
}
