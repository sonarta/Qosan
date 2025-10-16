<?php

namespace Database\Seeders;

use App\Models\SubscriptionPackage;
use Illuminate\Database\Seeder;

class SubscriptionPackageSeeder extends Seeder
{
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Free',
                'slug' => 'free',
                'description' => 'Paket gratis untuk mencoba platform',
                'price' => 0,
                'max_properties' => 1,
                'max_rooms' => 5,
                'features' => [
                    '1 Properti',
                    'Maksimal 5 Kamar',
                    'Manajemen Penyewa',
                    'Tagihan & Pembayaran',
                ],
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Basic',
                'slug' => 'basic',
                'description' => 'Paket dasar untuk owner kecil',
                'price' => 99000,
                'max_properties' => 3,
                'max_rooms' => 20,
                'features' => [
                    '3 Properti',
                    'Maksimal 20 Kamar',
                    'Manajemen Penyewa',
                    'Tagihan & Pembayaran',
                    'Laporan Keuangan',
                    'Export Data',
                ],
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Premium',
                'slug' => 'premium',
                'description' => 'Paket lengkap untuk owner menengah',
                'price' => 199000,
                'max_properties' => 10,
                'max_rooms' => 100,
                'features' => [
                    '10 Properti',
                    'Maksimal 100 Kamar',
                    'Semua Fitur Basic',
                    'Notifikasi WhatsApp',
                    'Priority Support',
                    'Custom Reports',
                ],
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Enterprise',
                'slug' => 'enterprise',
                'description' => 'Paket enterprise untuk owner besar',
                'price' => 499000,
                'max_properties' => 999,
                'max_rooms' => 9999,
                'features' => [
                    'Unlimited Properti',
                    'Unlimited Kamar',
                    'Semua Fitur Premium',
                    'Dedicated Support',
                    'API Access',
                    'Custom Integration',
                ],
                'is_active' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($packages as $package) {
            SubscriptionPackage::updateOrCreate(
                ['slug' => $package['slug']],
                $package
            );
        }
    }
}
