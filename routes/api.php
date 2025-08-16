<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TireController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// JAVNO: samo index i show za gume (imena: api.tires.index, api.tires.show)
Route::apiResource('tires', TireController::class)
    ->only(['index', 'show'])
    ->names('api.tires');

// ORDERS pod auth (imena: api.orders.*)
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('orders', OrderController::class)->names('api.orders');
});

// ADMIN: ostale tires akcije + users pod admin prefixom i name prefixom
Route::prefix('admin')
    ->middleware(['auth:sanctum', 'role:admin'])
    ->as('admin.')
    ->group(function () {
        // admin.tires.* (bez index i show da ne kolidira sa javnim)
        Route::apiResource('tires', TireController::class)->except(['index', 'show']);

        // admin.users.* (CRUD nad korisnicima)
        Route::apiResource('users', UserController::class);
    });
