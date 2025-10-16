<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            SubscriptionPackageSeeder::class,
            SubscriptionSeeder::class,
            PropertySeeder::class,
            RoomSeeder::class,
            TenantSeeder::class,
            BillSeeder::class,
            PaymentSeeder::class,
            BillingSettingSeeder::class,
        ]);

        $this->command->info('🎉 All seeders completed successfully!');
        $this->command->info('📧 Default login credentials:');
        $this->command->info('   Admin: admin@example.com / password');
        $this->command->info('   Owner: budi@owner.com / password');
    }
}
