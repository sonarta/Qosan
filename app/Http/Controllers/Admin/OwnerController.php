<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Property;
use App\Models\Subscription;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OwnerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::with(['subscription'])
            ->where('role', 'owner');

        // Filter by status
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->whereHas('subscription', function ($q) {
                    $q->where('status', 'active');
                });
            } elseif ($request->status === 'suspended') {
                $query->where('status', 'suspended');
            } elseif ($request->status === 'pending') {
                $query->whereDoesntHave('subscription');
            }
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $owners = $query->paginate(15)->withQueryString();

        // Add property count to each owner
        $owners->getCollection()->transform(function ($owner) {
            $owner->properties_count = Property::where('owner_id', $owner->id)->count();
            return $owner;
        });

        return Inertia::render('admin/owners/index', [
            'owners' => $owners,
            'filters' => $request->only(['search', 'status', 'sort_by', 'sort_order']),
        ]);
    }

    public function create(): Response
    {
        $packages = \App\Models\SubscriptionPackage::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $plans = [];
        foreach ($packages as $package) {
            $plans[$package->slug] = [
                'name' => $package->name,
                'price' => $package->price,
                'max_properties' => $package->max_properties,
                'max_rooms' => $package->max_rooms,
                'features' => $package->features,
            ];
        }

        return Inertia::render('admin/owners/create', [
            'plans' => $plans,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'plan_name' => 'required|in:free,basic,premium,enterprise',
        ]);

        DB::beginTransaction();

        try {
            // Create user
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'owner',
                'email_verified_at' => now(),
            ]);

            // Create subscription
            $package = \App\Models\SubscriptionPackage::where('slug', $validated['plan_name'])->first();

            if (!$package) {
                throw new \Exception('Paket tidak ditemukan');
            }

            Subscription::create([
                'user_id' => $user->id,
                'plan_name' => $package->slug,
                'max_properties' => $package->max_properties,
                'max_rooms' => $package->max_rooms,
                'start_date' => now(),
                'status' => 'active',
            ]);

            DB::commit();

            return redirect()->route('admin.owners.index')
                ->with('success', 'Owner berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menambahkan owner: ' . $e->getMessage()]);
        }
    }

    public function edit(User $owner): Response
    {
        $owner->load('subscription');
        
        $packages = \App\Models\SubscriptionPackage::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $plans = [];
        foreach ($packages as $package) {
            $plans[$package->slug] = [
                'name' => $package->name,
                'price' => $package->price,
                'max_properties' => $package->max_properties,
                'max_rooms' => $package->max_rooms,
                'features' => $package->features,
            ];
        }

        return Inertia::render('admin/owners/edit', [
            'owner' => $owner,
            'plans' => $plans,
        ]);
    }

    public function update(Request $request, User $owner): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($owner->id)],
            'password' => 'nullable|string|min:8',
        ]);

        try {
            $data = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];

            if (!empty($validated['password'])) {
                $data['password'] = Hash::make($validated['password']);
            }

            $owner->update($data);

            return redirect()->route('admin.owners.index')
                ->with('success', 'Owner berhasil diupdate.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal mengupdate owner: ' . $e->getMessage()]);
        }
    }

    public function destroy(User $owner): RedirectResponse
    {
        try {
            $owner->delete();

            return redirect()->route('admin.owners.index')
                ->with('success', 'Owner berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menghapus owner: ' . $e->getMessage()]);
        }
    }

    public function suspend(User $owner): RedirectResponse
    {
        try {
            $owner->update(['status' => 'suspended']);

            return back()->with('success', 'Owner berhasil disuspend.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal suspend owner: ' . $e->getMessage()]);
        }
    }

    public function activate(User $owner): RedirectResponse
    {
        try {
            $owner->update(['status' => 'active']);

            return back()->with('success', 'Owner berhasil diaktifkan.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal aktivasi owner: ' . $e->getMessage()]);
        }
    }

    public function changeSubscription(Request $request, User $owner): RedirectResponse
    {
        $validated = $request->validate([
            'plan_name' => 'required|in:free,basic,premium,enterprise',
        ]);

        DB::beginTransaction();

        try {
            $package = \App\Models\SubscriptionPackage::where('slug', $validated['plan_name'])->first();

            if (!$package) {
                throw new \Exception('Paket tidak ditemukan');
            }

            // Update or create subscription
            $subscription = $owner->subscription()->first();
            
            if ($subscription) {
                $subscription->update([
                    'plan_name' => $package->slug,
                    'max_properties' => $package->max_properties,
                    'max_rooms' => $package->max_rooms,
                ]);
            } else {
                Subscription::create([
                    'user_id' => $owner->id,
                    'plan_name' => $package->slug,
                    'max_properties' => $package->max_properties,
                    'max_rooms' => $package->max_rooms,
                    'start_date' => now(),
                    'status' => 'active',
                ]);
            }

            DB::commit();

            return back()->with('success', 'Paket langganan berhasil diubah.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal mengubah paket: ' . $e->getMessage()]);
        }
    }
}
