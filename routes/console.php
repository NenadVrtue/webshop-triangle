<?php

use App\Enums\Role;
use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// Add command to create user
Artisan::command('create:user {name} {email} {password} {--admin} {--company=} {--jib=} {--phone=}', function ($name, $email, $password) {
    $user = User::create([
        'full_name' => $name,
        'company_name' => $this->option('company') ?: 'N/A',
        'jib' => $this->option('jib') ?: 'N/A',
        'phone' => $this->option('phone') ?: 'N/A',
        'email' => $email,
        'password' => Hash::make($password),
        'role' => $this->option('admin') ? Role::Admin : Role::User,
        'is_active' => true,
    ]);

    $roleText = $user->role === Role::Admin ? 'Admin' : 'User';
    $this->info("Korisnik uspešno kreiran! Uloga: {$roleText}");
    $this->info("Ime: {$user->full_name}");
    $this->info("Email: {$user->email}");
})->purpose('Create a new user');

// Add command to make user admin
Artisan::command('make:admin {email}', function ($email) {
    $user = User::where('email', $email)->first();

    if (! $user) {
        $this->error("Korisnik sa email adresom {$email} nije pronađen.");

        return;
    }

    $user->role = Role::Admin;
    $user->save();

    $this->info("Korisnik {$user->full_name} ({$email}) je sada admin.");
})->purpose('Make a user admin by email');

// Add command to check user role
Artisan::command('check:role {email}', function ($email) {
    $user = User::where('email', $email)->first();

    if (! $user) {
        $this->error("Korisnik sa email adresom {$email} nije pronađen.");

        return;
    }

    $roleName = match ($user->role) {
        Role::Admin => 'Admin',
        Role::Sales => 'Sales',
        Role::User => 'User',
        default => 'Nepoznato'
    };

    $this->info("Korisnik: {$user->full_name}");
    $this->info("Email: {$user->email}");
    $this->info("Uloga: {$roleName} ({$user->role->value})");
    $this->info('Aktivan: '.($user->is_active ? 'Da' : 'Ne'));
})->purpose('Check user role by email');
