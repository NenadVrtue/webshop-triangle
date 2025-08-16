<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\User */
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'company_name'  => $this->company_name,
            'email'         => $this->email,
            'jib'           => $this->jib,
            'full_name'     => $this->full_name,
            'phone'         => $this->phone,
            'role'          => $this->role?->value, // 0 ili 1
            'role_name'     => $this->role?->name,  // "User" ili "Admin"
            'is_active'     => (bool) $this->is_active,
            'email_verified_at' => $this->email_verified_at,
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at,
        ];
    }
}
