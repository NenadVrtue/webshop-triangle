<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = $request->user();

        Log::info('Login redirect decision', [
            'user_id'    => $user?->id,
            'role_raw'   => $user?->getAttribute('role'), // int iz baze
            'role_value' => $user?->role?->value,         // 0 ili 1
            'role_name'  => $user?->role?->name,          // "User" ili "Admin"
            'is_admin'   => method_exists($user, 'isAdmin') ? $user->isAdmin() : null,
            'intended'   => $request->session()->get('url.intended'),
        ]);

        if ($user && method_exists($user, 'isAdmin') && $user->isAdmin()) {
            $intended = $request->session()->pull('url.intended'); // ukloni intended
            $intendedPath = $intended ? (parse_url($intended, PHP_URL_PATH) ?? '') : '';

            if ($intended && str_starts_with($intendedPath, '/admin')) {
                return redirect()->to($intended);
            }

            return redirect()->route('admin.dashboard');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
