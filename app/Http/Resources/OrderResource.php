<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'user' => $this->user ? $this->user->only(['id', 'name', 'email']) : null,
            'status' => $this->status,
            'order_date' => $this->order_date,
            
            // Customer information
            'customer_name' => $this->customer_name,
            'customer_email' => $this->customer_email,
            'customer_phone' => $this->customer_phone,
            'company_name' => $this->company_name,
            
            // Address information
            'address' => $this->address,
            'city' => $this->city,
            'postal_code' => $this->postal_code,
            'notes' => $this->notes,
            
            // Pricing information
            'subtotal' => $this->subtotal,
            'discount_amount' => $this->discount_amount,
            'total' => $this->total,
            'discount' => $this->discount, // Legacy field for backward compatibility
            
            // Order items
            'items' => $this->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'tire_id' => $item->tire_id,
                    'tire' => [
                        'id' => $item->tire->id,
                        'sifra' => $item->tire->sifra,
                        'naziv' => $item->tire->naziv,
                        'tip' => $item->tire->tip,
                        'dimenzije' => $item->tire->dimenzije,
                        'brend' => $item->tire->brend,
                        'veleprodajna_cijena' => $item->tire->veleprodajna_cijena,
                    ],
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total_price' => $item->total_price,
                ];
            }),
        ];
    }
}
