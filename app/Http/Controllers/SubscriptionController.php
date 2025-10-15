<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\Room;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        
        // Get or create default subscription (free plan)
        $subscription = $user->subscription()->first();
        
        if (!$subscription) {
            $subscription = Subscription::create([
                'user_id' => $user->id,
                'plan_name' => 'free',
                'max_properties' => 1,
                'max_rooms' => 5,
                'start_date' => now(),
                'status' => 'active',
            ]);
        }

        // Get current usage
        $currentProperties = Property::where('owner_id', $user->id)->count();
        $currentRooms = Room::whereHas('property', function ($query) use ($user) {
            $query->where('owner_id', $user->id);
        })->count();

        // Get all available plans
        $plans = Subscription::getPlans();

        return Inertia::render('subscription/index', [
            'subscription' => $subscription,
            'currentUsage' => [
                'properties' => $currentProperties,
                'rooms' => $currentRooms,
            ],
            'plans' => $plans,
        ]);
    }
}
