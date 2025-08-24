<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    protected $fillable = [
        'user_id',
        'tire_type',
        'percentage',
    ];

    // Veza sa User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
