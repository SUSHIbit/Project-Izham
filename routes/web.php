<?php

use App\Http\Controllers\Admin\EnemyController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Player routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard (battle screen)
    Route::get('/dashboard', [GameController::class, 'dashboard'])->name('dashboard');
    
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Enemy management
    Route::resource('enemies', EnemyController::class);
});

// API routes for React
Route::middleware('auth')->prefix('api')->group(function () {
    Route::get('/enemies/random', [GameController::class, 'getRandomEnemy']);
    Route::post('/battle/action', [GameController::class, 'processAction']);
});

require __DIR__.'/auth.php';