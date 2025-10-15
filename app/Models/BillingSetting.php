<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillingSetting extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'auto_generate_enabled',
        'generation_day',
        'due_days',
        'send_email_notification',
        'send_sms_notification',
        'email_template',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'auto_generate_enabled' => 'boolean',
            'generation_day' => 'integer',
            'due_days' => 'integer',
            'send_email_notification' => 'boolean',
            'send_sms_notification' => 'boolean',
        ];
    }

    public static function get(): self
    {
        return self::firstOrCreate([], [
            'auto_generate_enabled' => true,
            'generation_day' => 1,
            'due_days' => 7,
            'send_email_notification' => false,
            'send_sms_notification' => false,
        ]);
    }
}
