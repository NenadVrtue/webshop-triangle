<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TireController;
use App\Http\Controllers\Api\OrderController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('tires', TireController::class);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('orders', OrderController::class);
});

