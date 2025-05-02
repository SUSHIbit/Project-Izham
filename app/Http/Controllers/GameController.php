<?php

namespace App\Http\Controllers;

use App\Models\Enemy;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GameController extends Controller
{
    /**
     * Show the game dashboard.
     */
    public function dashboard()
    {
        return Inertia::render('Dashboard');
    }

    /**
     * Get a random enemy for battle.
     */
    public function getRandomEnemy()
    {
        $enemy = Enemy::inRandomOrder()->first();
        
        if (!$enemy) {
            return response()->json(['error' => 'No enemies found'], 404);
        }
        
        // Clone the enemy data to avoid modifying the database record
        $battleEnemy = [
            'id' => $enemy->id,
            'name' => $enemy->name,
            'hp' => $enemy->hp,
            'max_hp' => $enemy->hp,
            'attack' => $enemy->attack,
            'defense' => $enemy->defense,
            'image_path' => $enemy->image_path ? asset('storage/' . $enemy->image_path) : null,
        ];
        
        return response()->json(['enemy' => $battleEnemy]);
    }

    /**
     * Process a battle action.
     */
    public function processAction(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|string|in:attack,defend,heal,skill',
            'player' => 'required|array',
            'enemy' => 'required|array',
            'battleState' => 'required|array',
        ]);

        $player = $validated['player'];
        $enemy = $validated['enemy'];
        $battleState = $validated['battleState'];
        $action = $validated['action'];
        
        // Process player's turn
        $result = $this->processPlayerTurn($player, $enemy, $battleState, $action);
        $player = $result['player'];
        $enemy = $result['enemy'];
        $battleState = $result['battleState'];
        $message = $result['message'];
        
        // Check if battle is over after player's turn
        if ($enemy['hp'] <= 0) {
            return response()->json([
                'player' => $player,
                'enemy' => $enemy,
                'battleState' => $battleState,
                'message' => $message,
                'gameOver' => true,
                'victory' => true,
            ]);
        }
        
        // Process enemy's turn if battle isn't over
        $result = $this->processEnemyTurn($player, $enemy, $battleState);
        $player = $result['player'];
        $enemy = $result['enemy'];
        $battleState = $result['battleState'];
        $message .= "\n" . $result['message'];
        
        // Check if battle is over after enemy's turn
        $gameOver = $player['hp'] <= 0;
        
        return response()->json([
            'player' => $player,
            'enemy' => $enemy,
            'battleState' => $battleState,
            'message' => $message,
            'gameOver' => $gameOver,
            'victory' => !$gameOver,
        ]);
    }

    /**
     * Process the player's turn based on the chosen action.
     */
    private function processPlayerTurn($player, $enemy, $battleState, $action)
    {
        $message = '';
        
        switch ($action) {
            case 'attack':
                $damage = max(1, $player['attack'] - $enemy['defense']);
                $enemy['hp'] = max(0, $enemy['hp'] - $damage);
                $message = "You attack for {$damage} damage!";
                break;
                
            case 'defend':
                $battleState['isDefending'] = true;
                $message = "You take a defensive stance!";
                break;
                
            case 'heal':
                $healAmount = max(10, floor($player['max_hp'] * 0.2));
                $player['hp'] = min($player['max_hp'], $player['hp'] + $healAmount);
                $message = "You heal for {$healAmount} HP!";
                break;
                
            case 'skill':
                if ($battleState['skillUses'] > 0) {
                    $damage = max(1, $player['attack'] * 2 - $enemy['defense']);
                    $enemy['hp'] = max(0, $enemy['hp'] - $damage);
                    $battleState['skillUses']--;
                    $message = "You use a powerful skill for {$damage} damage! ({$battleState['skillUses']} uses left)";
                } else {
                    $message = "No skill uses remaining! Defaulting to normal attack.";
                    $damage = max(1, $player['attack'] - $enemy['defense']);
                    $enemy['hp'] = max(0, $enemy['hp'] - $damage);
                    $message .= " You attack for {$damage} damage!";
                }
                break;
        }
        
        return [
            'player' => $player,
            'enemy' => $enemy,
            'battleState' => $battleState,
            'message' => $message,
        ];
    }

    /**
     * Process the enemy's turn.
     */
    private function processEnemyTurn($player, $enemy, $battleState)
    {
        $message = '';
        
        if ($enemy['hp'] <= 0) {
            return [
                'player' => $player,
                'enemy' => $enemy,
                'battleState' => $battleState,
                'message' => 'The enemy was defeated!',
            ];
        }
        
        // Simple AI: always attack
        $damage = max(1, $enemy['attack'] - $player['defense']);
        
        // Apply defense bonus if player is defending
        if ($battleState['isDefending']) {
            $damage = max(1, floor($damage * 0.5));
            $battleState['isDefending'] = false;
            $message = "The enemy attacks! Your defense reduces the damage to {$damage}.";
        } else {
            $message = "The enemy attacks for {$damage} damage!";
        }
        
        $player['hp'] = max(0, $player['hp'] - $damage);
        
        return [
            'player' => $player,
            'enemy' => $enemy,
            'battleState' => $battleState,
            'message' => $message,
        ];
    }
}