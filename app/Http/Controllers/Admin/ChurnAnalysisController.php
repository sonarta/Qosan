<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ChurnAnalysisController extends Controller
{
    public function index(Request $request): Response
    {
        // Owner Churn Metrics
        $ownerChurnMetrics = $this->getOwnerChurnMetrics();

        // Tenant Churn Metrics
        $tenantChurnMetrics = $this->getTenantChurnMetrics();

        // Churn Trend (Last 12 months)
        $churnTrend = $this->getChurnTrend();

        // Churn by Subscription Plan
        $churnByPlan = $this->getChurnBySubscriptionPlan();

        // Retention Rate
        $retentionMetrics = $this->getRetentionMetrics();

        // At-Risk Owners (subscriptions expiring soon)
        $atRiskOwners = $this->getAtRiskOwners();

        // Churned Owners Details
        $churnedOwners = $this->getChurnedOwners();

        // Tenant Turnover Rate by Property
        $tenantTurnoverByProperty = $this->getTenantTurnoverByProperty();

        // Churn Reasons Analysis (if we had this data)
        $churnReasons = $this->getChurnReasons();

        return Inertia::render('admin/churn-analysis', [
            'ownerChurnMetrics' => $ownerChurnMetrics,
            'tenantChurnMetrics' => $tenantChurnMetrics,
            'churnTrend' => $churnTrend,
            'churnByPlan' => $churnByPlan,
            'retentionMetrics' => $retentionMetrics,
            'atRiskOwners' => $atRiskOwners,
            'churnedOwners' => $churnedOwners,
            'tenantTurnoverByProperty' => $tenantTurnoverByProperty,
            'churnReasons' => $churnReasons,
        ]);
    }

    private function getOwnerChurnMetrics(): array
    {
        $totalOwners = User::where('role', 'owner')->count();
        $activeOwners = User::where('role', 'owner')->where('status', 'active')->count();
        $suspendedOwners = User::where('role', 'owner')->where('status', 'suspended')->count();
        
        // Owners with expired subscriptions
        $expiredSubscriptions = Subscription::where('status', 'expired')->count();
        $cancelledSubscriptions = Subscription::where('status', 'cancelled')->count();

        $churnedOwners = $suspendedOwners + $expiredSubscriptions + $cancelledSubscriptions;
        $churnRate = $totalOwners > 0 ? round(($churnedOwners / $totalOwners) * 100, 2) : 0;

        return [
            'total_owners' => $totalOwners,
            'active_owners' => $activeOwners,
            'churned_owners' => $churnedOwners,
            'churn_rate' => $churnRate,
            'suspended_owners' => $suspendedOwners,
            'expired_subscriptions' => $expiredSubscriptions,
        ];
    }

    private function getTenantChurnMetrics(): array
    {
        $totalTenants = Tenant::count();
        $activeTenants = Tenant::where('is_active', true)->count();
        $churnedTenants = Tenant::where('is_active', false)->count();

        // Tenants who left in the last 30 days
        $recentChurn = Tenant::where('is_active', false)
            ->whereNotNull('check_out_date')
            ->where('check_out_date', '>=', now()->subDays(30))
            ->count();

        $churnRate = $totalTenants > 0 ? round(($churnedTenants / $totalTenants) * 100, 2) : 0;

        // Average tenant lifetime (in days)
        $avgLifetime = Tenant::where('is_active', false)
            ->whereNotNull('check_out_date')
            ->get()
            ->avg(function ($tenant) {
                return \Carbon\Carbon::parse($tenant->check_in_date)
                    ->diffInDays(\Carbon\Carbon::parse($tenant->check_out_date));
            });

        return [
            'total_tenants' => $totalTenants,
            'active_tenants' => $activeTenants,
            'churned_tenants' => $churnedTenants,
            'churn_rate' => $churnRate,
            'recent_churn_30_days' => $recentChurn,
            'avg_tenant_lifetime_days' => round($avgLifetime ?? 0, 2),
        ];
    }

    private function getChurnTrend(): array
    {
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            
            // Owner churn
            $ownerChurn = Subscription::where('status', 'expired')
                ->whereYear('end_date', $date->year)
                ->whereMonth('end_date', $date->month)
                ->count();

            // Tenant churn
            $tenantChurn = Tenant::where('is_active', false)
                ->whereNotNull('check_out_date')
                ->whereYear('check_out_date', $date->year)
                ->whereMonth('check_out_date', $date->month)
                ->count();

            $months[] = [
                'month' => $date->format('M Y'),
                'owner_churn' => $ownerChurn,
                'tenant_churn' => $tenantChurn,
            ];
        }

        return $months;
    }

    private function getChurnBySubscriptionPlan(): array
    {
        return Subscription::select(
                'plan_name',
                DB::raw('count(*) as total'),
                DB::raw('sum(case when status = "expired" or status = "cancelled" then 1 else 0 end) as churned'),
                DB::raw('sum(case when status = "active" then 1 else 0 end) as active')
            )
            ->groupBy('plan_name')
            ->get()
            ->map(function ($item) {
                $churnRate = $item->total > 0 
                    ? round(($item->churned / $item->total) * 100, 2) 
                    : 0;

                return [
                    'plan' => ucfirst($item->plan_name),
                    'total' => $item->total,
                    'churned' => $item->churned,
                    'active' => $item->active,
                    'churn_rate' => $churnRate,
                ];
            })
            ->toArray();
    }

    private function getRetentionMetrics(): array
    {
        // Calculate retention rate for the last 6 months
        $sixMonthsAgo = now()->subMonths(6);
        
        $ownersAtStart = User::where('role', 'owner')
            ->where('created_at', '<=', $sixMonthsAgo)
            ->count();

        $ownersRetained = User::where('role', 'owner')
            ->where('created_at', '<=', $sixMonthsAgo)
            ->where('status', 'active')
            ->count();

        $ownerRetentionRate = $ownersAtStart > 0 
            ? round(($ownersRetained / $ownersAtStart) * 100, 2) 
            : 0;

        // Tenant retention
        $tenantsAtStart = Tenant::where('check_in_date', '<=', $sixMonthsAgo)->count();
        $tenantsRetained = Tenant::where('check_in_date', '<=', $sixMonthsAgo)
            ->where('is_active', true)
            ->count();

        $tenantRetentionRate = $tenantsAtStart > 0 
            ? round(($tenantsRetained / $tenantsAtStart) * 100, 2) 
            : 0;

        return [
            'owner_retention_rate' => $ownerRetentionRate,
            'tenant_retention_rate' => $tenantRetentionRate,
            'period' => '6 months',
        ];
    }

    private function getAtRiskOwners(): array
    {
        // Owners with subscriptions expiring in the next 30 days
        return User::select(
                'users.id',
                'users.name',
                'users.email',
                'subscriptions.plan_name',
                'subscriptions.end_date',
                DB::raw("DATEDIFF(subscriptions.end_date, NOW()) as days_until_expiry")
            )
            ->join('subscriptions', 'users.id', '=', 'subscriptions.user_id')
            ->where('users.role', 'owner')
            ->where('subscriptions.status', 'active')
            ->whereNotNull('subscriptions.end_date')
            ->whereBetween('subscriptions.end_date', [now(), now()->addDays(30)])
            ->orderBy('subscriptions.end_date')
            ->limit(20)
            ->get()
            ->map(function ($owner) {
                return [
                    'id' => $owner->id,
                    'name' => $owner->name,
                    'email' => $owner->email,
                    'plan' => ucfirst($owner->plan_name),
                    'end_date' => $owner->end_date,
                    'days_until_expiry' => $owner->days_until_expiry,
                ];
            })
            ->toArray();
    }

    private function getChurnedOwners(): array
    {
        return User::select(
                'users.id',
                'users.name',
                'users.email',
                'users.status',
                'users.created_at',
                DB::raw('(select plan_name from subscriptions where user_id = users.id order by created_at desc limit 1) as last_plan')
            )
            ->where('users.role', 'owner')
            ->where(function($query) {
                $query->where('users.status', 'suspended')
                    ->orWhereHas('subscription', function($q) {
                        $q->whereIn('status', ['expired', 'cancelled']);
                    });
            })
            ->orderByDesc('users.created_at')
            ->limit(20)
            ->get()
            ->map(function ($owner) {
                return [
                    'id' => $owner->id,
                    'name' => $owner->name,
                    'email' => $owner->email,
                    'status' => $owner->status,
                    'last_plan' => ucfirst($owner->last_plan ?? 'Unknown'),
                    'joined_date' => $owner->created_at->format('Y-m-d'),
                ];
            })
            ->toArray();
    }

    private function getTenantTurnoverByProperty(): array
    {
        return DB::table('properties')
            ->select(
                'properties.id',
                'properties.name',
                DB::raw('count(distinct tenants.id) as total_tenants'),
                DB::raw('sum(case when tenants.is_active = 0 then 1 else 0 end) as churned_tenants'),
                DB::raw('sum(case when tenants.is_active = 1 then 1 else 0 end) as active_tenants')
            )
            ->join('rooms', 'properties.id', '=', 'rooms.property_id')
            ->join('tenants', 'rooms.id', '=', 'tenants.room_id')
            ->groupBy('properties.id', 'properties.name')
            ->orderByDesc('churned_tenants')
            ->limit(10)
            ->get()
            ->map(function ($property) {
                $turnoverRate = $property->total_tenants > 0 
                    ? round(($property->churned_tenants / $property->total_tenants) * 100, 2) 
                    : 0;

                return [
                    'property_name' => $property->name,
                    'total_tenants' => $property->total_tenants,
                    'churned_tenants' => $property->churned_tenants,
                    'active_tenants' => $property->active_tenants,
                    'turnover_rate' => $turnoverRate,
                ];
            })
            ->toArray();
    }

    private function getChurnReasons(): array
    {
        // This is placeholder data - in a real system, you'd collect this from exit surveys
        return [
            ['reason' => 'Price too high', 'count' => 15, 'percentage' => 30],
            ['reason' => 'Found better alternative', 'count' => 12, 'percentage' => 24],
            ['reason' => 'Limited features', 'count' => 10, 'percentage' => 20],
            ['reason' => 'Poor customer support', 'count' => 8, 'percentage' => 16],
            ['reason' => 'Other', 'count' => 5, 'percentage' => 10],
        ];
    }
}
