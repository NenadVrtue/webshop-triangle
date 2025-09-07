<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\PromoCodeController;
use App\Http\Controllers\Api\TireController;
use App\Models\Discount;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Sales\DashboardController as SalesDashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::post('/login', [AuthenticatedSessionController::class, 'store']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/checkout', [OrderController::class, 'checkout'])->name('checkout');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}/success', [OrderController::class, 'success'])->name('orders.success');
});

Route::get('/register', [RegisteredUserController::class, 'create'])
    ->middleware('guest')
    ->name('register');
Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest');

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->as('admin.')
    ->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::patch('/orders/{order}/status', [AdminDashboardController::class, 'updateOrderStatus'])->name('orders.update-status');
    });

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::patch('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::patch('/users/{user}/soft-delete', [UserController::class, 'softDelete'])->name('users.soft-delete');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::post('/promocodes', [PromoCodeController::class, 'store'])->name('promocodes.store');
    Route::patch('/promocodes/{promoCode}', [PromoCodeController::class, 'update'])->name('promocodes.update');
    Route::delete('/promocodes/{promoCode}', [PromoCodeController::class, 'destroy'])->name('promocodes.destroy');
    Route::get('/discounts', [DiscountController::class, 'index'])->name('discounts.index');
    Route::post('/discounts', [DiscountController::class, 'store'])->name('discounts.store');
    
    // Tire management routes
    Route::patch('/admin/tires/{tire}', [TireController::class, 'update'])->name('admin.tires.update');
});

// Sales routes (protected by sales role)
Route::middleware(['auth', 'verified', 'role:sales'])
    ->prefix('sales')
    ->as('sales.')
    ->group(function () {
        Route::get('/', [SalesDashboardController::class, 'index'])->name('dashboard');
        Route::patch('/orders/{order}/status', [SalesDashboardController::class, 'updateOrderStatus'])->name('orders.update-status');
    });

Route::middleware(['auth', 'verified', 'role:sales'])->group(function () {
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
