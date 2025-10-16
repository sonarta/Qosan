<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\Payment;
use App\Models\Property;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('q', '');
        
        if (strlen($query) < 2) {
            return response()->json(['results' => []]);
        }

        $results = [];
        $user = Auth::user();

        // Search Properties
        $properties = Property::where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('address_line1', 'like', "%{$query}%")
                  ->orWhere('city', 'like', "%{$query}%");
            })
            ->when(!$user->isAdmin(), function($q) use ($user) {
                $q->where('owner_id', $user->id);
            })
            ->limit(5)
            ->get();

        foreach ($properties as $property) {
            $results[] = [
                'type' => 'property',
                'id' => $property->id,
                'title' => $property->name,
                'subtitle' => $property->city . ' - ' . $property->total_units . ' units',
                'url' => route('properties.show', $property),
            ];
        }

        // Search Tenants
        $tenants = Tenant::where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%")
                  ->orWhere('phone', 'like', "%{$query}%");
            })
            ->with('room.property')
            ->when(!$user->isAdmin(), function($q) use ($user) {
                $q->whereHas('room.property', function($query) use ($user) {
                    $query->where('owner_id', $user->id);
                });
            })
            ->limit(5)
            ->get();

        foreach ($tenants as $tenant) {
            $results[] = [
                'type' => 'tenant',
                'id' => $tenant->id,
                'title' => $tenant->name,
                'subtitle' => $tenant->room->property->name . ' - ' . $tenant->room->name,
                'url' => route('tenants.show', $tenant),
            ];
        }

        // Search Bills
        $bills = Bill::where('bill_number', 'like', "%{$query}%")
            ->with('tenant.room.property')
            ->when(!$user->isAdmin(), function($q) use ($user) {
                $q->whereHas('tenant.room.property', function($query) use ($user) {
                    $query->where('owner_id', $user->id);
                });
            })
            ->limit(5)
            ->get();

        foreach ($bills as $bill) {
            $results[] = [
                'type' => 'bill',
                'id' => $bill->id,
                'title' => $bill->bill_number,
                'subtitle' => $bill->tenant->name . ' - Rp ' . number_format($bill->total, 0, ',', '.'),
                'url' => route('bills.show', $bill),
            ];
        }

        // Search Payments
        $payments = Payment::where('payment_number', 'like', "%{$query}%")
            ->with('bill.tenant')
            ->when(!$user->isAdmin(), function($q) use ($user) {
                $q->whereHas('bill.tenant.room.property', function($query) use ($user) {
                    $query->where('owner_id', $user->id);
                });
            })
            ->limit(5)
            ->get();

        foreach ($payments as $payment) {
            $results[] = [
                'type' => 'payment',
                'id' => $payment->id,
                'title' => $payment->payment_number,
                'subtitle' => $payment->bill->tenant->name . ' - Rp ' . number_format($payment->amount, 0, ',', '.'),
                'url' => route('payments.index') . '?payment=' . $payment->id,
            ];
        }

        // Admin only: Search Owners
        if ($user->isAdmin()) {
            $owners = User::where('role', 'owner')
                ->where(function($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                      ->orWhere('email', 'like', "%{$query}%");
                })
                ->limit(5)
                ->get();

            foreach ($owners as $owner) {
                $results[] = [
                    'type' => 'owner',
                    'id' => $owner->id,
                    'title' => $owner->name,
                    'subtitle' => $owner->email . ' - ' . ucfirst($owner->status),
                    'url' => route('admin.owners.show', $owner),
                ];
            }
        }

        return response()->json([
            'results' => $results,
            'total' => count($results),
        ]);
    }
}
