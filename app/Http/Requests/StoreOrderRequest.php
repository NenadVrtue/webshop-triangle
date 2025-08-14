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
            // Order items
            'items' => 'required|array|min:1',
            'items.*.tire_id' => 'required|exists:tires,id',
            'items.*.quantity' => 'required|integer|min:1',
            
            // Pricing
            'discount' => 'nullable|numeric|min:0',
            
            // Customer information
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'company_name' => 'nullable|string|max:255',
            
            // Address information
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            
            // Additional notes
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages()
    {
        return [
            'items.required' => 'Morate dodati najmanje jedan proizvod u narudžbu.',
            'items.*.tire_id.required' => 'ID gume je obavezan.',
            'items.*.tire_id.exists' => 'Odabrana guma ne postoji.',
            'items.*.quantity.required' => 'Količina je obavezna.',
            'items.*.quantity.min' => 'Količina mora biti najmanje 1.',
            
            'customer_name.required' => 'Ime i prezime je obavezno.',
            'customer_email.required' => 'Email adresa je obavezna.',
            'customer_email.email' => 'Email adresa mora biti validna.',
            'customer_phone.required' => 'Telefon je obavezan.',
            
            'address.required' => 'Adresa je obavezna.',
            'city.required' => 'Grad je obavezan.',
            'postal_code.required' => 'Poštanski broj je obavezan.',
            
        ];
    }
}
