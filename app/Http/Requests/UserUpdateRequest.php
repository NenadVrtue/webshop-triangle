<?php

namespace App\Http\Requests;

use App\Enums\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user')?->id ?? null;

        return [
            'company_name' => ['sometimes', 'required', 'string', 'max:255'],
            'email'        => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'jib'          => ['sometimes', 'nullable', 'string', 'max:50'],
            'full_name'    => ['sometimes', 'required', 'string', 'max:255'],
            'phone'        => ['sometimes', 'nullable', 'string', 'max:50'],
            'password'     => ['sometimes', 'nullable', 'string', 'min:8'],
            'role'         => ['sometimes', 'required', new Enum(Role::class)],
            'is_active'    => ['sometimes', 'required', 'boolean'],
        ];
    }
}
