<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enemy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EnemyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Group enemies by level_group
        $enemiesByGroup = Enemy::orderBy('level_group')
            ->orderBy('name')
            ->get()
            ->groupBy('level_group');
            
        $levelGroups = [
            1 => 'Levels 1-10',
            2 => 'Levels 11-20',
            3 => 'Levels 21-30',
            4 => 'Levels 31-50',
            5 => 'Levels 51-75',
            6 => 'Levels 76-99',
            7 => 'Level 100 (Final Boss)',
        ];
        
        return Inertia::render('Admin/Enemies/Index', [
            'enemiesByGroup' => $enemiesByGroup,
            'levelGroups' => $levelGroups,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $levelGroups = [
            1 => 'Levels 1-10',
            2 => 'Levels 11-20',
            3 => 'Levels 21-30',
            4 => 'Levels 31-50',
            5 => 'Levels 51-75',
            6 => 'Levels 76-99',
            7 => 'Level 100 (Final Boss)',
        ];
        
        return Inertia::render('Admin/Enemies/Create', [
            'levelGroups' => $levelGroups,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'hp' => 'required|integer|min:1',
            'attack_min' => 'required|integer|min:1',
            'attack_max' => 'required|integer|min:1|gte:attack_min',
            'defense' => 'required|integer|min:0',
            'level_group' => 'required|integer|min:1|max:7',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $enemy = new Enemy();
        $enemy->name = $validated['name'];
        $enemy->hp = $validated['hp'];
        $enemy->attack_min = $validated['attack_min'];
        $enemy->attack_max = $validated['attack_max'];
        $enemy->defense = $validated['defense'];
        $enemy->level_group = $validated['level_group'];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('enemies', 'public');
            $enemy->image_path = $path;
        }

        $enemy->save();

        return redirect()->route('admin.enemies.index')
            ->with('success', 'Enemy created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Enemy $enemy)
    {
        $levelGroups = [
            1 => 'Levels 1-10',
            2 => 'Levels 11-20',
            3 => 'Levels 21-30',
            4 => 'Levels 31-50',
            5 => 'Levels 51-75',
            6 => 'Levels 76-99',
            7 => 'Level 100 (Final Boss)',
        ];
        
        return Inertia::render('Admin/Enemies/Edit', [
            'enemy' => $enemy,
            'levelGroups' => $levelGroups,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Enemy $enemy)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'hp' => 'required|integer|min:1',
            'attack_min' => 'required|integer|min:1',
            'attack_max' => 'required|integer|min:1|gte:attack_min',
            'defense' => 'required|integer|min:0',
            'level_group' => 'required|integer|min:1|max:7',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $enemy->name = $validated['name'];
        $enemy->hp = $validated['hp'];
        $enemy->attack_min = $validated['attack_min'];
        $enemy->attack_max = $validated['attack_max'];
        $enemy->defense = $validated['defense'];
        $enemy->level_group = $validated['level_group'];

        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($enemy->image_path) {
                Storage::disk('public')->delete($enemy->image_path);
            }
            $path = $request->file('image')->store('enemies', 'public');
            $enemy->image_path = $path;
        }

        $enemy->save();

        return redirect()->route('admin.enemies.index')
            ->with('success', 'Enemy updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Enemy $enemy)
    {
        // Delete image if it exists
        if ($enemy->image_path) {
            Storage::disk('public')->delete($enemy->image_path);
        }

        $enemy->delete();

        return redirect()->route('admin.enemies.index')
            ->with('success', 'Enemy deleted successfully.');
    }
}