<?php

namespace App\Http\Controllers;

use App\Models\Enemy;
use App\Models\BattleLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GameController extends Controller
{
    /**
     * Current active battle session
     */
    private $battleSession = null;

    /**
     * Show the game dashboard.
     */
    public function dashboard()
    {
        // Redirect to player dashboard
        return redirect()->route('player.dashboard');
    }

    /**
     * Get a random enemy for battle based on player level.
     */
    public function getRandomEnemy(Request $request)
    {
        $playerLevel = $request->level ?? 1;
        
        // Determine level group
        $levelGroup = $this->getLevelGroupForLevel($playerLevel);
        
        // Get a random enemy from this level group
        $enemy = Enemy::where('level_group', $levelGroup)
            ->inRandomOrder()
            ->first();
        
        if (!$enemy) {
            // Fallback if no enemies found in this level group
            $enemy = Enemy::inRandomOrder()->first();
        }
        
        if (!$enemy) {
            return response()->json(['error' => 'No enemies found'], 404);
        }
        
        // Clone the enemy data to avoid modifying the database record
        // Scale enemy based on player level
        $levelScale = $this->getEnemyScaleForLevel($playerLevel);
        
        $battleEnemy = [
            'id' => $enemy->id,
            'name' => $enemy->name,
            'hp' => (int)($enemy->hp * $levelScale),
            'max_hp' => (int)($enemy->hp * $levelScale),
            'attack_min' => (int)($enemy->attack_min * $levelScale),
            'attack_max' => (int)($enemy->attack_max * $levelScale),
            'defense' => (int)($enemy->defense * $levelScale),
            'image_path' => $enemy->image_path ? asset('storage/' . $enemy->image_path) : null,
            'level_group' => $enemy->level_group,
        ];
        
        return response()->json(['enemy' => $battleEnemy]);
    }

    /**
     * Start a new battle session.
     */
    public function startBattle(Request $request)
    {
        $user = auth()->user();
        $playerProfile = $user->playerProfile;
        
        if (!$playerProfile) {
            return response()->json(['error' => 'Player profile not found'], 404);
        }
        
        // Initialize battle log
        $battleLog = BattleLog::create([
            'user_id' => $user->id,
            'level_reached' => $playerProfile->current_level,
            'enemies_defeated' => 0,
            'started_at' => Carbon::now(),
            'ended_at' => null,
        ]);
        
        // Set up session
        session(['battle_id' => $battleLog->id]);
        
        // Return player data
        $player = [
            'id' => $playerProfile->id,
            'name' => $playerProfile->name,
            'level' => $playerProfile->current_level,
            'hp' => $playerProfile->max_hp,
            'max_hp' => $playerProfile->max_hp,
            'attack_min' => $playerProfile->attack_min,
            'attack_max' => $playerProfile->attack_max,
            'defense' => $playerProfile->defense,
            'heal' => $playerProfile->heal,
        ];
        
        return response()->json([
            'player' => $player,
            'battleState' => [
                'isDefending' => false,
                'skillUses' => 3,
                'battleLog' => [],
            ],
        ]);
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
            // Player won the battle
            $this->processBattleVictory();
            
            return response()->json([
                'player' => $player,
                'enemy' => $enemy,
                'battleState' => $battleState,
                'message' => $message,
                'gameOver' => true,
                'victory' => true,
                'levelUp' => $this->shouldLevelUp($player['level']),
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
        
        if ($gameOver) {
            // Player lost the battle
            $this->processBattleDefeat();
        }
        
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
                // Random damage between min and max attack
                $attackDamage = rand($player['attack_min'], $player['attack_max']);
                $damage = max(1, $attackDamage - $enemy['defense']);
                $enemy['hp'] = max(0, $enemy['hp'] - $damage);
                $message = "You attack for {$damage} damage!";
                break;
                
            case 'defend':
                $battleState['isDefending'] = true;
                $message = "You take a defensive stance!";
                break;
                
            case 'heal':
                $healAmount = $player['heal'];
                $player['hp'] = min($player['max_hp'], $player['hp'] + $healAmount);
                $message = "You heal for {$healAmount} HP!";
                break;
                
            case 'skill':
                if ($battleState['skillUses'] > 0) {
                    // Skill does double damage
                    $attackDamage = rand($player['attack_min'], $player['attack_max']) * 2;
                    $damage = max(1, $attackDamage - $enemy['defense']);
                    $enemy['hp'] = max(0, $enemy['hp'] - $damage);
                    $battleState['skillUses']--;
                    $message = "You use a powerful skill for {$damage} damage! ({$battleState['skillUses']} uses left)";
                } else {
                    $message = "No skill uses remaining! Defaulting to normal attack.";
                    $attackDamage = rand($player['attack_min'], $player['attack_max']);
                    $damage = max(1, $attackDamage - $enemy['defense']);
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
        
        // Simple AI: random attack in range
        $attackDamage = rand($enemy['attack_min'], $enemy['attack_max']);
        $damage = max(1, $attackDamage - $player['defense']);
        
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

    /**
     * Process battle victory - update stats and check for level up.
     */
    private function processBattleVictory()
    {
        $user = auth()->user();
        $playerProfile = $user->playerProfile;
        
        if (!$playerProfile) {
            return;
        }
        
        // Record enemy defeated
        $battleLogId = session('battle_id');
        if ($battleLogId) {
            $battleLog = BattleLog::find($battleLogId);
            if ($battleLog) {
                $battleLog->enemies_defeated += 1;
                $battleLog->save();
            }
        }
        
        // Check if we need to level up
        if ($this->shouldLevelUp($playerProfile->current_level)) {
            $playerProfile->current_level += 1;
            
            // Update max level reached if needed
            if ($playerProfile->current_level > $user->max_level_reached) {
                $user->max_level_reached = $playerProfile->current_level;
                $user->save();
            }
            
            $playerProfile->save();
        }
    }

    /**
     * Process battle defeat - end battle log
     */
    private function processBattleDefeat()
    {
        $battleLogId = session('battle_id');
        if ($battleLogId) {
            $battleLog = BattleLog::find($battleLogId);
            if ($battleLog) {
                $battleLog->ended_at = Carbon::now();
                $battleLog->save();
            }
        }
    }

    /**
     * Level up logic - currently every enemy defeated
     */
    private function shouldLevelUp($currentLevel)
    {
        // For simplicity, we'll level up after every enemy 
        // In a real game, you might want more complex logic
        return true;
    }

    /**
     * Get the level group for a specific player level
     */
    private function getLevelGroupForLevel($level)
    {
        if ($level <= 10) return 1;
        if ($level <= 20) return 2;
        if ($level <= 30) return 3;
        if ($level <= 50) return 4;
        if ($level <= 75) return 5;
        if ($level <= 99) return 6;
        return 7; // Level 100 - final boss
    }

    /**
     * Get enemy scale factor based on player level
     */
    private function getEnemyScaleForLevel($level)
    {
        // Base scale is 1.0
        // Add 0.05 for every level above 1
        return 1.0 + (($level - 1) * 0.05);
    }

    /**
     * Handle level up choice - redirects to PlayerProfileController
     */
    public function levelUp(Request $request)
    {
        $request->validate([
            'stat' => 'required|string|in:max_hp,attack,defense,heal',
        ]);
        
        return app(PlayerProfileController::class)->upgradeStat($request);
    }
}