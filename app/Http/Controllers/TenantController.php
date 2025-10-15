<?php

namespace App\Http\Controllers;

use App\Http\Requests\TenantStoreRequest;
use App\Http\Requests\TenantUpdateRequest;
use App\Models\Room;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Tenant::with(['room.property']);

        // Filter by status (active/inactive)
        if ($request->filled('status')) {
            $isActive = $request->status === 'active';
            $query->where('is_active', $isActive);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $tenants = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('tenants/index', [
            'tenants' => $tenants,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        $availableRooms = Room::where('status', 'available')
            ->with('property')
            ->get();

        return Inertia::render('tenants/create', [
            'availableRooms' => $availableRooms,
        ]);
    }

    public function store(TenantStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();

        try {
            $data = $request->validated();
            $tenant = Tenant::create($data);

            // Auto-update room status to occupied
            $room = Room::find($data['room_id']);
            $room->update(['status' => 'occupied']);

            DB::commit();

            return redirect()->route('tenants.index')
                ->with('success', 'Penyewa berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menambahkan penyewa: ' . $e->getMessage()]);
        }
    }

    public function edit(Tenant $tenant): Response
    {
        $tenant->load(['room.property']);

        return Inertia::render('tenants/edit', [
            'tenant' => $tenant,
        ]);
    }

    public function update(TenantUpdateRequest $request, Tenant $tenant): RedirectResponse
    {
        try {
            $tenant->update($request->validated());

            return redirect()->route('tenants.index')
                ->with('success', 'Data penyewa berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal memperbarui data: ' . $e->getMessage()]);
        }
    }

    public function destroy(Tenant $tenant): RedirectResponse
    {
        try {
            $tenant->delete();

            return redirect()->route('tenants.index')
                ->with('success', 'Penyewa berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menghapus penyewa: ' . $e->getMessage()]);
        }
    }

    /**
     * Mark tenant as checked out
     */
    public function checkOut(Tenant $tenant): RedirectResponse
    {
        DB::beginTransaction();

        try {
            $tenant->update([
                'is_active' => false,
                'check_out_date' => now(),
            ]);

            // Auto-update room status to available
            $tenant->room->update(['status' => 'available']);

            DB::commit();

            return back()->with('success', 'Penyewa berhasil ditandai keluar.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menandai keluar: ' . $e->getMessage()]);
        }
    }
}
