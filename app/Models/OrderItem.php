<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'tire_id',
        'quantity',
        'unit_price',
        'total_price',
        'tire_id',
        'order_id',
    ];

    public function tire(): BelongsTo
    {
        return $this->belongsTo(Tire::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
