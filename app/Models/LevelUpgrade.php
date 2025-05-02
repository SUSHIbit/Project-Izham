<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LevelUpgrade extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'level',
        'stat_upgraded',
        'value_before',
        'value_after',
    ];

    /**
     * Get the user that owns the level upgrade.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}