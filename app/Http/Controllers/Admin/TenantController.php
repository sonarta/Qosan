<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Tenant::with(['room.property.owner']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhereHas('room.property', function ($q) use ($search) {
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

        $tenants = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/tenants/index', [
            'tenants' => $tenants,
            'filters' => $request->only(['search', 'status', 'sort_by', 'sort_order']),
        ]);
    }

    public function show(Tenant $tenant): Response
    {
        $tenant->load(['room.property.owner', 'bills.payments']);

        return Inertia::render('admin/tenants/show', [
            'tenant' => $tenant,
        ]);
    }
}
