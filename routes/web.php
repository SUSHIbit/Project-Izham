<?php

use App\Http\Controllers\Admin\EnemyController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\PlayerProfileController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Homepage route
Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/dashboard', [GameController::class, 'dashboard'])
    ->middleware(['auth'])
    ->name('dashboard');

// Leaderboard (public)
Route::get('/leaderboard', [PlayerProfileController::class, 'leaderboard'])
    ->name('leaderboard');

// Player routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Player dashboard
    Route::get('/player/dashboard', [PlayerProfileController::class, 'dashboard'])
        ->name('player.dashboard');
    
    // Update player name
    Route::post('/player/name', [PlayerProfileController::class, 'updateName'])
        ->name('player.updateName');
    
    // Start game
    Route::get('/player/start-game', [PlayerProfileController::class, 'startGame'])
        ->name('player.startGame');
    
    // Game routes
    Route::get('/game', [GameController::class, 'game'])
        ->name('game');
    
    // Level up
    Route::post('/game/level-up', [GameController::class, 'levelUp'])
        ->name('game.levelUp');
    
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});

// Admin routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Enemy management
    Route::resource('enemies', EnemyController::class);
});

// API routes for React
Route::middleware('auth')->prefix('api')->group(function () {
    // Battle API
    Route::get('/enemies/random', [GameController::class, 'getRandomEnemy']);
    Route::post('/battle/start', [GameController::class, 'startBattle']);
    Route::post('/battle/action', [GameController::class, 'processAction']);
});

require __DIR__.'/auth.php';