<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderItemRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'order_id' => ['required'],
            'tire_id' => ['required', 'exists:tires'],
            'quantity' => ['required', 'numeric'],
            'unit_price' => ['required', 'numeric'],
            'total_price' => ['required', 'numeric'],
            'tire_id' => ['required', 'exists:tires'],
            'order_id' => ['required'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
