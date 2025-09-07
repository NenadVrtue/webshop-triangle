<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\User;
use App\Enums\Role;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// Add command to make user admin
Artisan::command('make:admin {email}', function ($email) {
    $user = User::where('email', $email)->first();
    
    if (!$user) {
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
    
    if (!$user) {
        $this->error("Korisnik sa email adresom {$email} nije pronađen.");
        return;
    }
    
    $roleName = match($user->role) {
        Role::Admin => 'Admin',
        Role::Sales => 'Sales',
        Role::User => 'User',
        default => 'Nepoznato'
    };
    
    $this->info("Korisnik: {$user->full_name}");
    $this->info("Email: {$user->email}");
    $this->info("Uloga: {$roleName} ({$user->role->value})");
    $this->info("Aktivan: " . ($user->is_active ? 'Da' : 'Ne'));
})->purpose('Check user role by email');
