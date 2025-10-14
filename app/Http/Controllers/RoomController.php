<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomStoreRequest;
use App\Http\Requests\RoomUpdateRequest;
use App\Models\Property;
use App\Models\Room;
use App\Models\RoomImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Room::with(['property', 'images']);

        // Filter by property
        if ($request->filled('property_id')) {
            $query->where('property_id', $request->property_id);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhereHas('property', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $rooms = $query->paginate(12)->withQueryString();

        // Get properties for filter dropdown
        $properties = Property::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('rooms/index', [
            'rooms' => $rooms,
            'properties' => $properties,
            'filters' => $request->only(['search', 'property_id', 'status', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $properties = Property::select('id', 'name')->orderBy('name')->get();
        $selectedPropertyId = $request->get('property_id');

        return Inertia::render('rooms/create', [
            'properties' => $properties,
            'selectedPropertyId' => $selectedPropertyId,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoomStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();

        try {
            $data = $request->validated();
            $data['slug'] = Str::slug($data['name']) . '-' . Str::random(6);

            $room = Room::create($data);

            // Handle image uploads
            if ($request->hasFile('images')) {
                $this->handleImageUploads($room, $request->file('images'));
            }

            DB::commit();

            return redirect()->route('rooms.index')
                ->with('success', 'Room created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create room: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Room $room): Response
    {
        $room->load(['property', 'images']);

        return Inertia::render('rooms/show', [
            'room' => $room,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Room $room): Response
    {
        $room->load(['images', 'property']);
        $properties = Property::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('rooms/edit', [
            'room' => $room,
            'properties' => $properties,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoomUpdateRequest $request, Room $room): RedirectResponse
    {
        DB::beginTransaction();

        try {
            $data = $request->validated();
            
            // Update slug if name changed
            if ($data['name'] !== $room->name) {
                $data['slug'] = Str::slug($data['name']) . '-' . Str::random(6);
            }

            $room->update($data);

            // Handle image deletions
            if ($request->filled('delete_images')) {
                $this->handleImageDeletions($room, $request->delete_images);
            }

            // Handle new image uploads
            if ($request->hasFile('images')) {
                $currentImageCount = $room->images()->count();
                $newImageCount = count($request->file('images'));
                
                if ($currentImageCount + $newImageCount > 3) {
                    return back()->withErrors(['images' => 'Maximum 3 images allowed per room.']);
                }

                $this->handleImageUploads($room, $request->file('images'));
            }

            DB::commit();

            return redirect()->route('rooms.index')
                ->with('success', 'Room updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update room: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Room $room): RedirectResponse
    {
        DB::beginTransaction();

        try {
            // Delete all room images from storage
            foreach ($room->images as $image) {
                Storage::disk('public')->delete($image->path);
            }

            $room->delete();

            DB::commit();

            return redirect()->route('rooms.index')
                ->with('success', 'Room deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to delete room: ' . $e->getMessage()]);
        }
    }

    /**
     * Update room status (quick action)
     */
    public function updateStatus(Request $request, Room $room): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'in:available,occupied,maintenance'],
        ]);

        $room->update(['status' => $request->status]);

        return back()->with('success', 'Room status updated successfully.');
    }

    /**
     * Handle image uploads for a room
     */
    private function handleImageUploads(Room $room, array $images): void
    {
        $isFirstImage = $room->images()->count() === 0;

        foreach ($images as $index => $image) {
            $filename = Str::random(20) . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('rooms/' . $room->id, $filename, 'public');

            $room->images()->create([
                'path' => $path,
                'filename' => $image->getClientOriginalName(),
                'order' => $index,
                'is_primary' => $isFirstImage && $index === 0,
            ]);
        }
    }

    /**
     * Handle image deletions for a room
     */
    private function handleImageDeletions(Room $room, array $imageIds): void
    {
        $images = RoomImage::whereIn('id', $imageIds)
            ->where('room_id', $room->id)
            ->get();

        foreach ($images as $image) {
            Storage::disk('public')->delete($image->path);
            $image->delete();
        }

        // If primary image was deleted, set first remaining image as primary
        if (!$room->images()->where('is_primary', true)->exists()) {
            $firstImage = $room->images()->orderBy('order')->first();
            if ($firstImage) {
                $firstImage->update(['is_primary' => true]);
            }
        }
    }
}
