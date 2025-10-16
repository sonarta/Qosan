<?php

namespace Database\Seeders;

use App\Models\Bill;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $paidBills = Bill::where('status', 'paid')->get();
        $admin = User::where('role', 'admin')->first();

        if ($paidBills->isEmpty()) {
            $this->command->warn('No paid bills found. Skipping payment seeder.');
            return;
        }

        foreach ($paidBills as $bill) {
            $paymentMethods = ['Transfer Bank', 'Cash', 'E-Wallet', 'QRIS'];
            $paymentDate = $bill->bill_date->copy()->addDays(rand(1, 5));

            $payment = Payment::create([
                'bill_id' => $bill->id,
                'payment_number' => $this->generatePaymentNumber($paymentDate),
                'amount' => $bill->total,
                'payment_date' => $paymentDate,
                'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                'proof_image' => 'payments/proof-' . $bill->bill_number . '.jpg',
                'status' => 'confirmed',
                'notes' => 'Pembayaran lunas',
                'confirmed_at' => $paymentDate->copy()->addHours(rand(1, 24)),
                'confirmed_by' => $admin?->id,
            ]);

            $this->command->info("Created payment: {$payment->payment_number} for bill: {$bill->bill_number}");
        }

        // Create some pending payments
        $unpaidBills = Bill::where('status', 'unpaid')->limit(3)->get();

        foreach ($unpaidBills as $bill) {
            $paymentMethods = ['Transfer Bank', 'E-Wallet'];
            $paymentDate = now()->subDays(rand(1, 3));

            $payment = Payment::create([
                'bill_id' => $bill->id,
                'payment_number' => $this->generatePaymentNumber($paymentDate),
                'amount' => $bill->total,
                'payment_date' => $paymentDate,
                'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                'proof_image' => 'payments/proof-' . $bill->bill_number . '.jpg',
                'status' => 'pending',
                'notes' => 'Menunggu konfirmasi',
                'confirmed_at' => null,
                'confirmed_by' => null,
            ]);

            $this->command->info("Created pending payment: {$payment->payment_number}");
        }
    }

    private function generatePaymentNumber($date): string
    {
        $prefix = 'PAY';
        $dateStr = $date->format('Ymd');
        $random = rand(1000, 9999);
        
        return sprintf('%s-%s-%04d', $prefix, $dateStr, $random);
    }
}
