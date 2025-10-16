<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\Room;
use App\Models\RoomImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $properties = Property::where('status', 'active')->get();

        if ($properties->isEmpty()) {
            $this->command->warn('No active properties found. Please seed properties first.');
            return;
        }

        $roomTypes = ['Standard', 'Deluxe', 'VIP', 'Suite'];
        $statuses = ['available', 'occupied', 'maintenance'];

        foreach ($properties as $property) {
            $roomCount = rand(5, 10);

            for ($i = 1; $i <= $roomCount; $i++) {
                $floor = rand(1, 3);
                $type = $roomTypes[array_rand($roomTypes)];
                $roomName = "Kamar {$i}";
                
                // Price based on type
                $basePrice = match($type) {
                    'Standard' => rand(800000, 1200000),
                    'Deluxe' => rand(1200000, 1800000),
                    'VIP' => rand(1800000, 2500000),
                    'Suite' => rand(2500000, 3500000),
                };

                $room = Room::create([
                    'property_id' => $property->id,
                    'name' => $roomName,
                    'slug' => Str::slug($property->name . '-' . $roomName) . '-' . Str::random(5),
                    'type' => $type,
                    'floor' => $floor,
                    'size' => rand(12, 30), // m2
                    'capacity' => rand(1, 2),
                    'price' => $basePrice,
                    'status' => $statuses[array_rand($statuses)],
                    'description' => "Kamar {$type} di lantai {$floor} dengan fasilitas lengkap.",
                ]);

                // Create sample images using Picsum Photos (reliable placeholder)
                // Using different seed for each image to get variety
                $seed1 = ($room->id * 200) + 1;
                $seed2 = ($room->id * 200) + 2;
                $seed3 = ($room->id * 200) + 3;
                
                RoomImage::create([
                    'room_id' => $room->id,
                    'path' => "https://picsum.photos/seed/room-{$seed1}/800/600",
                    'filename' => 'room-' . $room->id . '-1.jpg',
                    'order' => 1,
                    'is_primary' => true,
                ]);

                RoomImage::create([
                    'room_id' => $room->id,
                    'path' => "https://picsum.photos/seed/room-{$seed2}/800/600",
                    'filename' => 'room-' . $room->id . '-2.jpg',
                    'order' => 2,
                    'is_primary' => false,
                ]);

                RoomImage::create([
                    'room_id' => $room->id,
                    'path' => "https://picsum.photos/seed/room-{$seed3}/800/600",
                    'filename' => 'room-' . $room->id . '-3.jpg',
                    'order' => 3,
                    'is_primary' => false,
                ]);
            }

            $this->command->info("Created {$roomCount} rooms for property: {$property->name}");
        }
    }
}
