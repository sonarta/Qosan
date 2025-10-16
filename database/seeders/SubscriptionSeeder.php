<?php

namespace Database\Seeders;

use App\Models\Subscription;
use App\Models\SubscriptionPackage;
use App\Models\User;
use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        $owners = User::where('role', 'owner')->get();
        $packages = SubscriptionPackage::all();

        if ($owners->isEmpty()) {
            $this->command->warn('No owner users found. Please seed users first.');
            return;
        }

        if ($packages->isEmpty()) {
            $this->command->warn('No subscription packages found. Please seed subscription packages first.');
            return;
        }

        foreach ($owners as $index => $owner) {
            // Assign different plans to different owners
            $package = match($index % 4) {
                0 => $packages->where('slug', 'free')->first(),
                1 => $packages->where('slug', 'basic')->first(),
                2 => $packages->where('slug', 'premium')->first(),
                3 => $packages->where('slug', 'enterprise')->first(),
                default => $packages->where('slug', 'free')->first(),
            };

            if (!$package) {
                $package = $packages->first();
            }

            $startDate = now()->subMonths(rand(1, 6));
            $endDate = $package->slug === 'free' ? null : $startDate->copy()->addYear();

            Subscription::create([
                'user_id' => $owner->id,
                'plan_name' => $package->slug,
                'max_properties' => $package->max_properties,
                'max_rooms' => $package->max_rooms,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => 'active',
            ]);

            $this->command->info("Created {$package->name} subscription for: {$owner->name}");
        }

        // Create an expired subscription
        $expiredOwner = $owners->first();
        $basicPackage = $packages->where('slug', 'basic')->first();

        if ($basicPackage) {
            Subscription::create([
                'user_id' => $expiredOwner->id,
                'plan_name' => $basicPackage->slug,
                'max_properties' => $basicPackage->max_properties,
                'max_rooms' => $basicPackage->max_rooms,
                'start_date' => now()->subYears(2),
                'end_date' => now()->subMonths(6),
                'status' => 'expired',
            ]);

            $this->command->info("Created expired subscription for: {$expiredOwner->name}");
        }
    }
}
