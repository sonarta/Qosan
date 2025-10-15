<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
        'plan_name',
        'max_properties',
        'max_rooms',
        'start_date',
        'end_date',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'active' && 
               ($this->end_date === null || $this->end_date->isFuture());
    }

    public static function getPlans(): array
    {
        return [
            'free' => [
                'name' => 'Free',
                'price' => 0,
                'max_properties' => 1,
                'max_rooms' => 5,
                'features' => [
                    '1 Properti',
                    'Maksimal 5 Kamar',
                    'Manajemen Penyewa',
                    'Tagihan & Pembayaran',
                ],
            ],
            'basic' => [
                'name' => 'Basic',
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
            ],
            'premium' => [
                'name' => 'Premium',
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
            ],
            'enterprise' => [
                'name' => 'Enterprise',
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
            ],
        ];
    }
}
