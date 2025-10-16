<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        $owners = User::where('role', 'owner')->get();

        if ($owners->isEmpty()) {
            $this->command->warn('No owner users found. Please seed users first.');
            return;
        }

        $properties = [
            [
                'name' => 'Kost Melati',
                'type' => 'Kost Putri',
                'address_line1' => 'Jl. Melati No. 123',
                'address_line2' => 'RT 01/RW 05',
                'city' => 'Jakarta',
                'state' => 'DKI Jakarta',
                'postal_code' => '12345',
                'country' => 'Indonesia',
                'total_units' => 10,
                'description' => 'Kost nyaman khusus putri dengan fasilitas lengkap, dekat kampus dan pusat kota.',
                'status' => 'active',
            ],
            [
                'name' => 'Kost Mawar',
                'type' => 'Kost Putra',
                'address_line1' => 'Jl. Mawar Indah No. 45',
                'address_line2' => null,
                'city' => 'Bandung',
                'state' => 'Jawa Barat',
                'postal_code' => '40123',
                'country' => 'Indonesia',
                'total_units' => 15,
                'description' => 'Kost putra dengan kamar luas, parkir luas, dan keamanan 24 jam.',
                'status' => 'active',
            ],
            [
                'name' => 'Kost Anggrek',
                'type' => 'Kost Campur',
                'address_line1' => 'Jl. Anggrek Raya No. 78',
                'address_line2' => 'Komplek Anggrek Residence',
                'city' => 'Surabaya',
                'state' => 'Jawa Timur',
                'postal_code' => '60123',
                'country' => 'Indonesia',
                'total_units' => 20,
                'description' => 'Kost campur modern dengan fasilitas gym, laundry, dan wifi super cepat.',
                'status' => 'active',
            ],
            [
                'name' => 'Kost Dahlia',
                'type' => 'Kost Putri',
                'address_line1' => 'Jl. Dahlia No. 12',
                'address_line2' => null,
                'city' => 'Yogyakarta',
                'state' => 'DI Yogyakarta',
                'postal_code' => '55123',
                'country' => 'Indonesia',
                'total_units' => 8,
                'description' => 'Kost putri dekat UGM, suasana tenang dan aman.',
                'status' => 'active',
            ],
            [
                'name' => 'Kost Tulip',
                'type' => 'Kost Putra',
                'address_line1' => 'Jl. Tulip Indah No. 99',
                'address_line2' => 'Dekat Stasiun',
                'city' => 'Semarang',
                'state' => 'Jawa Tengah',
                'postal_code' => '50123',
                'country' => 'Indonesia',
                'total_units' => 12,
                'description' => 'Kost putra strategis dekat stasiun dan pusat bisnis.',
                'status' => 'draft',
            ],
        ];

        foreach ($properties as $index => $propertyData) {
            $owner = $owners->random();
            
            $property = Property::create([
                'owner_id' => $owner->id,
                'name' => $propertyData['name'],
                'slug' => Str::slug($propertyData['name']) . '-' . Str::random(5),
                'type' => $propertyData['type'],
                'address_line1' => $propertyData['address_line1'],
                'address_line2' => $propertyData['address_line2'],
                'city' => $propertyData['city'],
                'state' => $propertyData['state'],
                'postal_code' => $propertyData['postal_code'],
                'country' => $propertyData['country'],
                'total_units' => $propertyData['total_units'],
                'description' => $propertyData['description'],
                'status' => $propertyData['status'],
            ]);

            // Create sample images (placeholder paths)
            PropertyImage::create([
                'property_id' => $property->id,
                'path' => 'properties/' . $property->slug . '/image-1.jpg',
                'filename' => 'image-1.jpg',
                'order' => 1,
                'is_primary' => true,
            ]);

            PropertyImage::create([
                'property_id' => $property->id,
                'path' => 'properties/' . $property->slug . '/image-2.jpg',
                'filename' => 'image-2.jpg',
                'order' => 2,
                'is_primary' => false,
            ]);

            $this->command->info("Created property: {$property->name}");
        }
    }
}
