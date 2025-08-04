<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Ako koristiš policy, promijeni po potrebi
    }

    public function rules()
    {
        return [
            'discount' => 'nullable|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.tire_id' => 'required|exists:tires,id',
            'items.*.quantity' => 'required|integer|min:1',
        ];
    }
}
