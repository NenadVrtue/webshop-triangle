<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'full_name'     => 'required|string|max:255',
            'email'         => 'required|string|lowercase|email|max:255|unique:users,email',
            'password'      => ['required', 'confirmed', Rules\Password::defaults()],
            'company_name'  => 'required|string|max:255',
            'jib'           => 'required|string|max:50|unique:users,jib',
            'phone'         => 'required|string|max:50',
        ]);

        $user = User::create([
            'full_name'    => $request->full_name,
            'email'        => $request->email,
            'password'     => Hash::make($request->password),
            'company_name' => $request->company_name,
            'jib'          => $request->jib,
            'phone'        => $request->phone,
            'is_active'    => true,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }

}
