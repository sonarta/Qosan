<?php

namespace App\Http\Controllers;

use App\Http\Requests\PropertyStoreRequest;
use App\Http\Requests\PropertyUpdateRequest;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Property::with(['owner', 'images', 'rooms'])
            ->withCount('rooms');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('address_line1', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by owner (for admin)
        if ($request->filled('owner_id')) {
            $query->where('owner_id', $request->owner_id);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $properties = $query->paginate(10)->withQueryString();

        return Inertia::render('properties/index', [
            'properties' => $properties,
            'filters' => $request->only(['search', 'status', 'type', 'owner_id', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('properties/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PropertyStoreRequest $request): RedirectResponse
    {
        // Check subscription limits
        $user = auth()->user();
        $subscription = $user->subscription;
        
        if (!$subscription) {
            return back()->withErrors(['error' => 'Anda belum memiliki paket langganan aktif.']);
        }

        $currentProperties = Property::where('owner_id', $user->id)->count();
        
        if ($currentProperties >= $subscription->max_properties) {
            return back()->withErrors([
                'error' => "Anda telah mencapai batas maksimal properti ({$subscription->max_properties}). Silakan upgrade paket langganan Anda."
            ]);
        }

        DB::beginTransaction();

        try {
            $data = $request->validated();
            $data['owner_id'] = auth()->id();
            $data['slug'] = Str::slug($data['name']) . '-' . Str::random(6);

            $property = Property::create($data);

            // Handle image uploads
            if ($request->hasFile('images')) {
                $this->handleImageUploads($property, $request->file('images'));
            }

            DB::commit();

            return redirect()->route('properties.index')
                ->with('success', 'Property created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create property: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Property $property): Response
    {
        $property->load(['owner', 'images', 'rooms']);

        return Inertia::render('properties/show', [
            'property' => $property,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Property $property): Response
    {
        $property->load(['images']);

        return Inertia::render('properties/edit', [
            'property' => $property,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PropertyUpdateRequest $request, Property $property): RedirectResponse
    {
        DB::beginTransaction();

        try {
            $data = $request->validated();
            
            // Update slug if name changed
            if ($data['name'] !== $property->name) {
                $data['slug'] = Str::slug($data['name']) . '-' . Str::random(6);
            }

            $property->update($data);

            // Handle image deletions
            if ($request->filled('delete_images')) {
                $this->handleImageDeletions($property, $request->delete_images);
            }

            // Handle new image uploads
            if ($request->hasFile('images')) {
                $currentImageCount = $property->images()->count();
                $newImageCount = count($request->file('images'));
                
                if ($currentImageCount + $newImageCount > 5) {
                    return back()->withErrors(['images' => 'Maximum 5 images allowed per property.']);
                }

                $this->handleImageUploads($property, $request->file('images'));
            }

            DB::commit();

            return redirect()->route('properties.index')
                ->with('success', 'Property updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update property: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Property $property): RedirectResponse
    {
        // Business rule: Cannot delete if there are active rooms
        $activeRoomsCount = $property->rooms()->where('status', 'occupied')->count();
        
        if ($activeRoomsCount > 0) {
            return back()->withErrors([
                'error' => "Cannot delete property. There are {$activeRoomsCount} occupied room(s)."
            ]);
        }

        DB::beginTransaction();

        try {
            // Delete all property images from storage
            foreach ($property->images as $image) {
                Storage::disk('public')->delete($image->path);
            }

            // Soft delete the property (cascade will handle images and rooms)
            $property->delete();

            DB::commit();

            return redirect()->route('properties.index')
                ->with('success', 'Property deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to delete property: ' . $e->getMessage()]);
        }
    }

    /**
     * Handle image uploads for a property
     */
    private function handleImageUploads(Property $property, array $images): void
    {
        $isFirstImage = $property->images()->count() === 0;

        foreach ($images as $index => $image) {
            $filename = Str::random(20) . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('properties/' . $property->id, $filename, 'public');

            $property->images()->create([
                'path' => $path,
                'filename' => $image->getClientOriginalName(),
                'order' => $index,
                'is_primary' => $isFirstImage && $index === 0,
            ]);
        }
    }

    /**
     * Handle image deletions for a property
     */
    private function handleImageDeletions(Property $property, array $imageIds): void
    {
        $images = PropertyImage::whereIn('id', $imageIds)
            ->where('property_id', $property->id)
            ->get();

        foreach ($images as $image) {
            Storage::disk('public')->delete($image->path);
            $image->delete();
        }

        // If primary image was deleted, set first remaining image as primary
        if (!$property->images()->where('is_primary', true)->exists()) {
            $firstImage = $property->images()->orderBy('order')->first();
            if ($firstImage) {
                $firstImage->update(['is_primary' => true]);
            }
        }
    }
}
