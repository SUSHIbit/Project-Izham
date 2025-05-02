<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlayerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'current_level',
        'max_hp',
        'attack_min',
        'attack_max',
        'defense',
        'heal',
    ];

    /**
     * Get the user that owns the profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the battle logs for the profile.
     */
    public function battleLogs()
    {
        return $this->hasMany(BattleLog::class, 'user_id', 'user_id');
    }

    /**
     * Get the level upgrades for the profile.
     */
    public function levelUpgrades()
    {
        return $this->hasMany(LevelUpgrade::class, 'user_id', 'user_id');
    }
}