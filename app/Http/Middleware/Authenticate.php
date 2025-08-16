<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo($request): ?string
    {
        if (! $request->expectsJson()) {
            // Ako imaš GET rutu za login, vrati route('login');
            // Ako nemaš (vidim samo POST /login), pošalji na početnu:
            return route('home');
        }

        return null;
    }
}
