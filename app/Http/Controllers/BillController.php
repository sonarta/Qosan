<?php

namespace App\Http\Controllers;

use App\Http\Requests\BillStoreRequest;
use App\Models\Bill;
use App\Models\Property;
use App\Models\Tenant;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class BillController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Bill::with(['tenant.room.property', 'items']);
        
        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        
        // Filter by property
        if ($request->filled('property_id')) {
            $query->whereHas('tenant.room', function($q) use ($request) {
                $q->where('property_id', $request->property_id);
            });
        }
        
        // Filter by period
        if ($request->filled('period')) {
            $period = Carbon::parse($request->period);
            $query->whereYear('period_start', $period->year)
                  ->whereMonth('period_start', $period->month);
        }
        
        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('bill_number', 'like', "%{$search}%")
                  ->orWhereHas('tenant', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }
        
        $bills = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
        $properties = Property::select('id', 'name')->orderBy('name')->get();
        
        return Inertia::render('bills/index', [
            'bills' => $bills,
            'properties' => $properties,
            'filters' => $request->only(['search', 'status', 'property_id', 'period']),
        ]);
    }

    public function create(): Response
    {
        $activeTenants = Tenant::where('is_active', true)
            ->with('room.property')
            ->get();
        
        return Inertia::render('bills/create', [
            'activeTenants' => $activeTenants,
        ]);
    }

    public function store(BillStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        
        try {
            $data = $request->validated();
            $data['bill_number'] = Bill::generateBillNumber();
            $data['bill_date'] = now();
            
            // Calculate totals
            $subtotal = collect($data['items'])->sum('total');
            $data['subtotal'] = $subtotal;
            $data['total'] = $subtotal;
            
            $bill = Bill::create($data);
            
            // Create bill items
            foreach ($data['items'] as $item) {
                $bill->items()->create($item);
            }
            
            DB::commit();
            
            return redirect()->route('bills.index')
                ->with('success', 'Tagihan berhasil dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function show(Bill $bill): Response
    {
        $bill->load(['tenant.room.property', 'items']);
        
        return Inertia::render('bills/show', [
            'bill' => $bill,
        ]);
    }

    public function destroy(Bill $bill): RedirectResponse
    {
        try {
            $bill->delete();
            
            return redirect()->route('bills.index')
                ->with('success', 'Tagihan berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function generatePdf(Bill $bill)
    {
        $bill->load(['tenant.room.property', 'items']);
        
        $pdf = Pdf::loadView('bills.invoice', compact('bill'));
        
        return $pdf->download("invoice-{$bill->bill_number}.pdf");
    }

    public function markAsPaid(Bill $bill): RedirectResponse
    {
        $bill->update(['status' => 'paid']);
        
        return back()->with('success', 'Tagihan ditandai sebagai lunas.');
    }
}
