<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enemy extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'hp',
        'attack_min',
        'attack_max',
        'defense',
        'level_group',
        'image_path',
    ];
}