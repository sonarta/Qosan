<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionMonitoringController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Subscription::with(['user']);

        // Filter by status
        if ($request->filled('status')) {
            if ($request->status === 'expiring') {
                // Subscriptions expiring in next 7 days
                $query->where('status', 'active')
                    ->whereNotNull('end_date')
                    ->whereBetween('end_date', [now(), now()->addDays(7)]);
            } else {
                $query->where('status', $request->status);
            }
        }

        // Filter by plan
        if ($request->filled('plan')) {
            $query->where('plan_name', $request->plan);
        }

        // Search by user
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $subscriptions = $query->paginate(15)->withQueryString();

        // Add usage stats to each subscription
        $subscriptions->getCollection()->transform(function ($subscription) {
            $userId = $subscription->user_id;
            $subscription->properties_count = \App\Models\Property::where('owner_id', $userId)->count();
            $subscription->rooms_count = \App\Models\Room::whereHas('property', function ($q) use ($userId) {
                $q->where('owner_id', $userId);
            })->count();
            return $subscription;
        });

        // Statistics
        $stats = [
            'total' => Subscription::count(),
            'active' => Subscription::where('status', 'active')->count(),
            'expired' => Subscription::where('status', 'expired')->count(),
            'expiring_soon' => Subscription::where('status', 'active')
                ->whereNotNull('end_date')
                ->whereBetween('end_date', [now(), now()->addDays(7)])
                ->count(),
        ];

        // Plan distribution
        $planDistribution = Subscription::select('plan_name', DB::raw('count(*) as count'))
            ->where('status', 'active')
            ->groupBy('plan_name')
            ->get();

        return Inertia::render('admin/subscriptions/index', [
            'subscriptions' => $subscriptions,
            'stats' => $stats,
            'planDistribution' => $planDistribution,
            'filters' => $request->only(['search', 'status', 'plan', 'sort_by', 'sort_order']),
        ]);
    }
}
