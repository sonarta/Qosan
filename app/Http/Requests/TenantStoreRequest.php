<?php

namespace App\Http\Requests;

use App\Models\Room;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TenantStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'room_id' => [
                'required',
                'exists:rooms,id',
                function ($attribute, $value, $fail) {
                    $room = Room::find($value);
                    if ($room && $room->status !== 'available') {
                        $fail('Kamar yang dipilih tidak tersedia.');
                    }
                },
            ],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'id_card_number' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'check_in_date' => ['required', 'date'],
            'check_out_date' => ['nullable', 'date', 'after:check_in_date'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
