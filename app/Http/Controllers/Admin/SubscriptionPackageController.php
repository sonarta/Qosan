<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPackage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionPackageController extends Controller
{
    public function index(): Response
    {
        $packages = SubscriptionPackage::orderBy('sort_order')->get();

        return Inertia::render('admin/packages/index', [
            'packages' => $packages,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/packages/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'max_properties' => 'required|integer|min:1',
            'max_rooms' => 'required|integer|min:1',
            'features' => 'required|array',
            'features.*' => 'required|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        SubscriptionPackage::create($validated);

        return redirect()->route('admin.packages.index')
            ->with('success', 'Paket berhasil ditambahkan.');
    }

    public function edit(SubscriptionPackage $package): Response
    {
        return Inertia::render('admin/packages/edit', [
            'package' => $package,
        ]);
    }

    public function update(Request $request, SubscriptionPackage $package): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'max_properties' => 'required|integer|min:1',
            'max_rooms' => 'required|integer|min:1',
            'features' => 'required|array',
            'features.*' => 'required|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $package->update($validated);

        return redirect()->route('admin.packages.index')
            ->with('success', 'Paket berhasil diupdate.');
    }

    public function destroy(SubscriptionPackage $package): RedirectResponse
    {
        // Check if package is being used
        $subscriptionsCount = \App\Models\Subscription::where('plan_name', $package->slug)->count();
        
        if ($subscriptionsCount > 0) {
            return back()->withErrors([
                'error' => "Paket ini sedang digunakan oleh {$subscriptionsCount} subscription. Tidak dapat dihapus."
            ]);
        }

        $package->delete();

        return redirect()->route('admin.packages.index')
            ->with('success', 'Paket berhasil dihapus.');
    }
}
