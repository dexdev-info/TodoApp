<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TodoController;
use App\Http\Controllers\Api\AuthController;

// ========================================
// PUBLIC ROUTES - Không cần auth
// ========================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ========================================
// PROTECTED ROUTES - Cần auth
// ========================================
Route::middleware('auth:sanctum')->group(function () {

    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Todos routes
    Route::apiResource('todos', TodoController::class);
    Route::patch('todos/{todo}/toggle', [TodoController::class, 'toggle']);

});