<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Property::with(['owner', 'rooms']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhereHas('owner', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $properties = $query->paginate(15)->withQueryString();

        // Add room count to each property
        $properties->getCollection()->transform(function ($property) {
            $property->rooms_count = $property->rooms->count();
            $property->occupied_rooms = $property->rooms->where('status', 'occupied')->count();
            return $property;
        });

        return Inertia::render('admin/properties/index', [
            'properties' => $properties,
            'filters' => $request->only(['search', 'status', 'sort_by', 'sort_order']),
        ]);
    }

    public function show(Property $property): Response
    {
        $property->load(['owner', 'rooms.images', 'images']);

        return Inertia::render('admin/properties/show', [
            'property' => $property,
        ]);
    }
}
