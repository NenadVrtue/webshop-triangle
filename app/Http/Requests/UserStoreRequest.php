<?php

namespace App\Http\Requests;

use App\Enums\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Rule;

class UserStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Dodatna zaštita postoji na ruti (role:admin), ovdje vraćamo true
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:255'],
            'email'        => ['required', 'email', 'max:255', 'unique:users,email'],
            'jib'          => ['nullable', 'string', 'max:50'],
            'full_name'    => ['required', 'string', 'max:255'],
            'phone'        => ['nullable', 'string', 'max:50'],
            'password'     => ['required', 'string', 'min:8'],
            'role'         => ['required', new Enum(Role::class)],
            'is_active'    => ['required', 'boolean'],
        ];
    }
}
