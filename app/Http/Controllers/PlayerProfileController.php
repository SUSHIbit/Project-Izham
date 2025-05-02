<?php

namespace App\Http\Controllers;

use App\Models\PlayerProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlayerProfileController extends Controller
{
    /**
     * Display the player dashboard.
     */
    public function dashboard()
    {
        $user = auth()->user();
        $playerProfile = $user->playerProfile;
        
        // Create a player profile if one doesn't exist
        if (!$playerProfile) {
            $playerProfile = PlayerProfile::create([
                'user_id' => $user->id,
                'current_level' => 1,
                'max_hp' => 100,
                'attack_min' => 10,
                'attack_max' => 15,
                'defense' => 5, 
                'heal' => 30,
            ]);
        }
        
        return Inertia::render('PlayerDashboard', [
            'playerProfile' => $playerProfile,
            'maxLevel' => $user->max_level_reached,
        ]);
    }
    
    /**
     * Update the player's name.
     */
    public function updateName(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        
        $user = auth()->user();
        $playerProfile = $user->playerProfile;
        
        if ($playerProfile) {
            $playerProfile->update([
                'name' => $request->name,
            ]);
        }
        
        return redirect()->back()->with('success', 'Character name updated!');
    }
    
    /**
     * Start a new game
     */
    public function startGame()
    {
        $user = auth()->user();
        $playerProfile = $user->playerProfile;
        
        // Ensure the player has a name before starting
        if (!$playerProfile || !$playerProfile->name) {
            return redirect()->back()->with('error', 'Please create a character name first!');
        }
        
        // Redirect to the game view
        return Inertia::render('Game', [
            'player' => $playerProfile,
            'level' => $playerProfile->current_level,
            'battleState' => [
                'isDefending' => false,
                'skillUses' => 3,
                'battleLog' => [],
            ],
        ]);
    }
    
    /**
     * Upgrade a stat after leveling up
     */
    public function upgradeStat(Request $request)
    {
        $request->validate([
            'stat' => 'required|string|in:max_hp,attack,defense,heal',
        ]);
        
        $user = auth()->user();
        $playerProfile = $user->playerProfile;
        $stat = $request->stat;
        
        if (!$playerProfile) {
            return response()->json(['error' => 'Player profile not found'], 404);
        }
        
        // Store the previous value
        $valueBefore = $playerProfile->{$stat};
        
        // Apply stat upgrade based on stat type
        switch ($stat) {
            case 'max_hp':
                $playerProfile->max_hp += 20;
                break;
            case 'attack':
                $playerProfile->attack_min += 2;
                $playerProfile->attack_max += 3;
                break;
            case 'defense':
                $playerProfile->defense += 2;
                break;
            case 'heal':
                $playerProfile->heal += 5;
                break;
        }
        
        $playerProfile->save();
        
        // Record the upgrade
        $user->levelUpgrades()->create([
            'level' => $playerProfile->current_level,
            'stat_upgraded' => $stat,
            'value_before' => $valueBefore,
            'value_after' => $playerProfile->{$stat},
        ]);
        
        return redirect()->back()->with('success', 'Stat upgraded successfully!');
    }
    
    /**
     * Display the leaderboard.
     */
    public function leaderboard()
    {
        // Get top 10 players by max level reached
        $topPlayers = User::where('max_level_reached', '>', 0)
            ->with('playerProfile')
            ->orderBy('max_level_reached', 'desc')
            ->take(10)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->playerProfile ? $user->playerProfile->name : 'Unknown',
                    'max_level' => $user->max_level_reached,
                ];
            });
        
        return Inertia::render('Leaderboard', [
            'topPlayers' => $topPlayers,
        ]);
    }
}