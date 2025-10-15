<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('billing_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('auto_generate_enabled')->default(true);
            $table->integer('generation_day')->default(1);
            $table->integer('due_days')->default(7);
            $table->boolean('send_email_notification')->default(false);
            $table->boolean('send_sms_notification')->default(false);
            $table->text('email_template')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('billing_settings');
    }
};
