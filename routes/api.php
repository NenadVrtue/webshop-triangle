<?php

use App\Http\Controllers\Auth\ApiAuthController;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TireController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\UserController;

Route::get('user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// JAVNE rute za gume
Route::apiResource('tires', TireController::class)
    ->only(['index', 'show'])
    ->names('api.tires');

// ADMIN rute - zaštićene sa role:admin
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::apiResource('users', UserController::class)
        ->names('api.users');
});

// ORDERS za sve autentifikovane korisnike
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('orders', OrderController::class)
        ->names('api.orders');
});

Route::post('/login', [ApiAuthController::class, 'login']);
Route::post('/logout', [ApiAuthController::class, 'logout'])->middleware('auth:sanctum');
