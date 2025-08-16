<?php
// app/Http/Middleware/EnsureUserHasRole.php

namespace App\Http\Middleware;

use App\Enums\Role;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string $requiredRole): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(401);
        }

        $map = [
            'admin' => Role::Admin,
            'user'  => Role::User,
        ];

        $roleEnum = $map[$requiredRole] ?? null;

        if (!$roleEnum || $user->role !== $roleEnum) {
            abort(403, 'Unauthorized.');
        }

        return $next($request);
    }
}
