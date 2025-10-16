<?php

namespace Database\Seeders;

use App\Models\Bill;
use App\Models\BillItem;
use App\Models\Tenant;
use Illuminate\Database\Seeder;

class BillSeeder extends Seeder
{
    public function run(): void
    {
        $tenants = Tenant::where('is_active', true)->with('room')->get();

        if ($tenants->isEmpty()) {
            $this->command->warn('No active tenants found. Please seed tenants first.');
            return;
        }

        foreach ($tenants as $tenant) {
            // Create bills for the last 3 months
            for ($month = 2; $month >= 0; $month--) {
                $periodStart = now()->subMonths($month)->startOfMonth();
                $periodEnd = now()->subMonths($month)->endOfMonth();
                $billDate = $periodStart->copy();
                $dueDate = $billDate->copy()->addDays(7);

                // Determine bill status
                $status = 'unpaid';
                if ($month > 0) {
                    $status = ['paid', 'paid', 'overdue'][array_rand(['paid', 'paid', 'overdue'])];
                }

                $bill = Bill::create([
                    'tenant_id' => $tenant->id,
                    'bill_number' => $this->generateBillNumber($billDate),
                    'bill_date' => $billDate,
                    'due_date' => $dueDate,
                    'period_start' => $periodStart,
                    'period_end' => $periodEnd,
                    'subtotal' => 0, // Will be calculated
                    'total' => 0, // Will be calculated
                    'status' => $status,
                    'notes' => $month === 0 ? 'Tagihan bulan ini' : null,
                ]);

                // Create bill items
                $roomPrice = $tenant->room->price;
                
                // Room rent
                BillItem::create([
                    'bill_id' => $bill->id,
                    'description' => 'Sewa Kamar - ' . $tenant->room->name,
                    'amount' => $roomPrice,
                    'quantity' => 1,
                    'total' => $roomPrice,
                ]);

                $subtotal = $roomPrice;

                // Add utilities (random)
                if (rand(0, 1)) {
                    $electricityAmount = rand(50000, 200000);
                    BillItem::create([
                        'bill_id' => $bill->id,
                        'description' => 'Listrik',
                        'amount' => $electricityAmount,
                        'quantity' => 1,
                        'total' => $electricityAmount,
                    ]);
                    $subtotal += $electricityAmount;
                }

                if (rand(0, 1)) {
                    $waterAmount = rand(30000, 100000);
                    BillItem::create([
                        'bill_id' => $bill->id,
                        'description' => 'Air',
                        'amount' => $waterAmount,
                        'quantity' => 1,
                        'total' => $waterAmount,
                    ]);
                    $subtotal += $waterAmount;
                }

                // Service charge
                $serviceCharge = 50000;
                BillItem::create([
                    'bill_id' => $bill->id,
                    'description' => 'Biaya Service',
                    'amount' => $serviceCharge,
                    'quantity' => 1,
                    'total' => $serviceCharge,
                ]);
                $subtotal += $serviceCharge;

                // Update bill totals
                $bill->update([
                    'subtotal' => $subtotal,
                    'total' => $subtotal,
                ]);

                $this->command->info("Created bill: {$bill->bill_number} for tenant: {$tenant->name}");
            }
        }
    }

    private function generateBillNumber($date): string
    {
        $prefix = 'INV';
        $dateStr = $date->format('Ymd');
        $random = rand(1000, 9999);
        
        return sprintf('%s-%s-%04d', $prefix, $dateStr, $random);
    }
}
