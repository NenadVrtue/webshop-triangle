<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Enums\Role;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();
        
        // Check if user has the required role
        if ($role === 'admin' && !$user->isAdmin()) {
            abort(403, 'Nemate dozvolu za pristup ovoj stranici.');
        }

        return $next($request);
    }
}
