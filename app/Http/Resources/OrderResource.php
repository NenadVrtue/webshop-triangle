<?php

namespace App\Http\Resources;
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
            'discount' => $this->discount,
            'order_date' => $this->order_date,
            'items' => $this->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'tire_id' => $item->tire_id,
                    'tire_name' => $item->tire->name,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total_price' => $item->total_price,
                ];
            }),
        ];
    }
}
