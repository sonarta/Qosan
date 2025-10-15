<?php

namespace App\Console\Commands;

use App\Models\Bill;
use App\Models\Tenant;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class GenerateMonthlyBills extends Command
{
    protected $signature = 'bills:generate-monthly';
    protected $description = 'Generate monthly bills for active tenants';

    public function handle()
    {
        $this->info('Starting monthly bill generation...');

        $activeTenants = Tenant::where('is_active', true)
            ->with('room')
            ->get();

        if ($activeTenants->isEmpty()) {
            $this->warn('No active tenants found.');
            return 0;
        }

        $generated = 0;
        $failed = 0;

        foreach ($activeTenants as $tenant) {
            DB::beginTransaction();
            
            try {
                // Check if bill already exists for this month
                $existingBill = Bill::where('tenant_id', $tenant->id)
                    ->whereYear('period_start', now()->year)
                    ->whereMonth('period_start', now()->month)
                    ->first();

                if ($existingBill) {
                    $this->warn("Bill already exists for tenant: {$tenant->name}");
                    continue;
                }

                $bill = Bill::create([
                    'tenant_id' => $tenant->id,
                    'bill_number' => Bill::generateBillNumber(),
                    'bill_date' => now(),
                    'due_date' => now()->addDays(7),
                    'period_start' => now()->startOfMonth(),
                    'period_end' => now()->endOfMonth(),
                    'subtotal' => $tenant->room->price,
                    'total' => $tenant->room->price,
                    'status' => 'unpaid',
                ]);

                $bill->items()->create([
                    'description' => 'Sewa Kamar - ' . $tenant->room->name,
                    'amount' => $tenant->room->price,
                    'quantity' => 1,
                    'total' => $tenant->room->price,
                ]);

                DB::commit();
                $generated++;
                $this->info("✓ Generated bill for: {$tenant->name} ({$bill->bill_number})");
            } catch (\Exception $e) {
                DB::rollBack();
                $failed++;
                $this->error("✗ Failed for tenant {$tenant->name}: {$e->getMessage()}");
            }
        }

        $this->info("\n=== Summary ===");
        $this->info("Total active tenants: {$activeTenants->count()}");
        $this->info("Bills generated: {$generated}");
        if ($failed > 0) {
            $this->warn("Failed: {$failed}");
        }
        $this->info("===============\n");

        return 0;
    }
}
