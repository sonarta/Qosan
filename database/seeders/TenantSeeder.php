<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\Tenant;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class TenantSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $rooms = Room::where('status', 'occupied')->get();

        if ($rooms->isEmpty()) {
            $this->command->warn('No occupied rooms found. Randomly selecting available rooms.');
            $rooms = Room::where('status', 'available')->limit(10)->get();
        }

        foreach ($rooms as $room) {
            // Create active tenant for occupied rooms
            $checkInDate = now()->subMonths(rand(1, 12));
            
            $tenant = Tenant::create([
                'room_id' => $room->id,
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'phone' => $faker->phoneNumber,
                'id_card_number' => $faker->numerify('################'),
                'address' => $faker->address,
                'check_in_date' => $checkInDate,
                'check_out_date' => null,
                'is_active' => true,
                'notes' => $faker->optional()->sentence,
            ]);

            // Update room status to occupied
            $room->update(['status' => 'occupied']);

            $this->command->info("Created tenant: {$tenant->name} for room: {$room->name}");
        }

        // Create some inactive tenants (past tenants)
        $pastRooms = Room::whereDoesntHave('tenants', function($query) {
            $query->where('is_active', true);
        })->limit(5)->get();

        foreach ($pastRooms as $room) {
            $checkInDate = now()->subMonths(rand(13, 24));
            $checkOutDate = $checkInDate->copy()->addMonths(rand(3, 12));

            Tenant::create([
                'room_id' => $room->id,
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'phone' => $faker->phoneNumber,
                'id_card_number' => $faker->numerify('################'),
                'address' => $faker->address,
                'check_in_date' => $checkInDate,
                'check_out_date' => $checkOutDate,
                'is_active' => false,
                'notes' => 'Penyewa lama yang sudah pindah.',
            ]);

            $this->command->info("Created past tenant for room: {$room->name}");
        }
    }
}
