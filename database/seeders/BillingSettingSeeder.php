<?php

namespace Database\Seeders;

use App\Models\BillingSetting;
use Illuminate\Database\Seeder;

class BillingSettingSeeder extends Seeder
{
    public function run(): void
    {
        BillingSetting::firstOrCreate(
            ['id' => 1],
            [
                'auto_generate_enabled' => true,
                'generation_day' => 1, // Generate on 1st of each month
                'due_days' => 7, // Due 7 days after generation
                'send_email_notification' => false,
                'send_sms_notification' => false,
                'email_template' => 'Yth. {tenant_name},

Berikut adalah tagihan untuk periode {period_start} - {period_end}:

Nomor Tagihan: {bill_number}
Total Tagihan: Rp {total}
Jatuh Tempo: {due_date}

Mohon untuk melakukan pembayaran sebelum tanggal jatuh tempo.

Terima kasih,
{property_name}',
            ]
        );

        $this->command->info('Billing settings created successfully.');
    }
}
