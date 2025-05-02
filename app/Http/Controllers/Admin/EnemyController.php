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
        $enemies = Enemy::all();
        return Inertia::render('Admin/Enemies/Index', [
            'enemies' => $enemies,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Enemies/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'hp' => 'required|integer|min:1',
            'attack' => 'required|integer|min:1',
            'defense' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $enemy = new Enemy();
        $enemy->name = $validated['name'];
        $enemy->hp = $validated['hp'];
        $enemy->attack = $validated['attack'];
        $enemy->defense = $validated['defense'];

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
        return Inertia::render('Admin/Enemies/Edit', [
            'enemy' => $enemy,
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
            'attack' => 'required|integer|min:1',
            'defense' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $enemy->name = $validated['name'];
        $enemy->hp = $validated['hp'];
        $enemy->attack = $validated['attack'];
        $enemy->defense = $validated['defense'];

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