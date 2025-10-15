<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\Room;
use App\Models\Tenant;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Overview Stats
        $totalProperties = Property::count();
        $totalRooms = Room::count();
        $activeTenants = Tenant::where('is_active', true)->count();
        
        // Calculate monthly revenue (assuming price is monthly rent)
        $monthlyRevenue = Room::where('status', 'occupied')
            ->sum('price');

        // Occupancy Data for Chart
        $occupancyData = [
            'occupied' => Room::where('status', 'occupied')->count(),
            'available' => Room::where('status', 'available')->count(),
            'maintenance' => Room::where('status', 'maintenance')->count(),
        ];

        // Recent Activities (last 10)
        $recentActivities = $this->getRecentActivities();

        // Urgent Bills (mock data - implement based on your billing system)
        $urgentBills = [];

        return Inertia::render('dashboard', [
            'stats' => [
                'totalProperties' => $totalProperties,
                'totalRooms' => $totalRooms,
                'activeTenants' => $activeTenants,
                'monthlyRevenue' => $monthlyRevenue,
            ],
            'occupancyData' => $occupancyData,
            'recentActivities' => $recentActivities,
            'urgentBills' => $urgentBills,
        ]);
    }

    private function getRecentActivities(): array
    {
        $activities = [];

        // Recent tenants (last 5)
        $recentTenants = Tenant::with(['room.property'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        foreach ($recentTenants as $tenant) {
            $activities[] = [
                'type' => 'tenant_added',
                'title' => 'Penyewa Baru',
                'description' => "{$tenant->name} masuk ke {$tenant->room->name}",
                'timestamp' => $tenant->created_at->diffForHumans(),
                'created_at' => $tenant->created_at,
            ];
        }

        // Recent properties (last 3)
        $recentProperties = Property::orderBy('created_at', 'desc')
            ->limit(3)
            ->get();

        foreach ($recentProperties as $property) {
            $activities[] = [
                'type' => 'property_added',
                'title' => 'Properti Baru',
                'description' => "Properti {$property->name} ditambahkan",
                'timestamp' => $property->created_at->diffForHumans(),
                'created_at' => $property->created_at,
            ];
        }

        // Sort by created_at desc
        usort($activities, function ($a, $b) {
            return $b['created_at'] <=> $a['created_at'];
        });

        // Return only 10 most recent
        return array_slice($activities, 0, 10);
    }
}
