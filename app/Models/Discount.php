<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    protected $fillable = [
        'scope',
        'user_id',
        'tire_kategorija',
        'percentage',
    ];

    // Veza sa User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scope za app-wide popuste
    public function scopeAppWide($query)
    {
        return $query->where('scope', 'app_wide');
    }

    // Scope za per-user popuste
    public function scopePerUser($query)
    {
        return $query->where('scope', 'per_user');
    }

    // Provera da li je app-wide popust
    public function isAppWide()
    {
        return $this->scope === 'app_wide';
    }

    // Provera da li je per-user popust
    public function isPerUser()
    {
        return $this->scope === 'per_user';
    }
}
