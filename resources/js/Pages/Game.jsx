import React, { useState, useEffect } from "react";
import axios from "axios";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Game({ auth, player, level, battleState }) {
    const [loading, setLoading] = useState(true);
    const [enemy, setEnemy] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState({
        ...player,
        hp: player.max_hp,
    });
    const [currentBattleState, setCurrentBattleState] = useState(battleState);
    const [message, setMessage] = useState("");
    const [gameOver, setGameOver] = useState(false);
    const [victory, setVictory] = useState(false);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [enemiesDefeated, setEnemiesDefeated] = useState(0);

    // Load a random enemy when component mounts
    useEffect(() => {
        startBattle();
    }, []);

    const startBattle = async () => {
        try {
            setLoading(true);

            // Start a new battle session
            const sessionResponse = await axios.post("/api/battle/start");

            // Get enemy for the current level
            const enemyResponse = await axios.get("/api/enemies/random", {
                params: { level: level },
            });

            setEnemy(enemyResponse.data.enemy);
            setCurrentPlayer({
                ...player,
                hp: player.max_hp,
            });
            setCurrentBattleState({
                isDefending: false,
                skillUses: 3,
                battleLog: [],
            });
            setMessage(
                `Level ${level}: A ${enemyResponse.data.enemy.name} appears!`
            );
            setGameOver(false);
            setVictory(false);
            setLoading(false);
        } catch (error) {
            console.error("Error starting battle:", error);
            setMessage("Error loading enemy. Please try again.");
            setLoading(false);
        }
    };

    const performAction = async (action) => {
        if (gameOver || loading) return;

        try {
            setLoading(true);
            const response = await axios.post("/api/battle/action", {
                action,
                player: currentPlayer,
                enemy: enemy,
                battleState: currentBattleState,
            });

            setCurrentPlayer(response.data.player);
            setEnemy(response.data.enemy);
            setCurrentBattleState(response.data.battleState);
            setMessage(response.data.message);

            if (response.data.gameOver) {
                setGameOver(true);
                setVictory(response.data.victory);

                if (response.data.victory) {
                    setEnemiesDefeated((prev) => prev + 1);
                    if (response.data.levelUp) {
                        setShowLevelUp(true);
                    }
                }
            }

            setLoading(false);
        } catch (error) {
            console.error("Error processing action:", error);
            setMessage("Error processing action. Please try again.");
            setLoading(false);
        }
    };

    const handleLevelUp = async (stat) => {
        try {
            await axios.post("/api/game/level-up", { stat });
            setShowLevelUp(false);

            // Redirect to player dashboard to show updated stats
            router.visit(route("player.dashboard"));
        } catch (error) {
            console.error("Error leveling up:", error);
            setMessage("Error processing level up. Please try again.");
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dungeon Level {level}
                </h2>
            }
        >
            <Head title={`Level ${level}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-800 text-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6">
                            {/* Level Info */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold">
                                        Level {level} | Enemies Defeated:{" "}
                                        {enemiesDefeated}
                                    </h3>
                                    <p className="text-sm text-gray-300">
                                        Character: {player.name}
                                    </p>
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center p-4">
                                    <div className="inline-block w-8 h-8 border-4 border-t-4 border-gray-200 rounded-full animate-spin"></div>
                                    <p className="mt-2">Loading battle...</p>
                                </div>
                            ) : enemy ? (
                                <div className="battle-screen">
                                    {/* Battle Status */}
                                    <div className="battle-status mb-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            {/* Player Stats */}
                                            <div className="player-stats bg-gray-700 p-4 rounded-lg">
                                                <h3 className="text-lg font-bold mb-2">
                                                    {player.name}
                                                </h3>
                                                <div className="hp-bar bg-gray-900 w-full h-4 rounded-full">
                                                    <div
                                                        className="bg-green-500 h-4 rounded-full"
                                                        style={{
                                                            width: `${Math.max(
                                                                0,
                                                                (currentPlayer.hp /
                                                                    currentPlayer.max_hp) *
                                                                    100
                                                            )}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="mt-1">
                                                    HP: {currentPlayer.hp} /{" "}
                                                    {currentPlayer.max_hp}
                                                </div>
                                                <div>
                                                    Attack:{" "}
                                                    {currentPlayer.attack_min} -{" "}
                                                    {currentPlayer.attack_max}
                                                </div>
                                                <div>
                                                    Defense:{" "}
                                                    {currentPlayer.defense}
                                                </div>
                                                <div>
                                                    Heal: {currentPlayer.heal}
                                                </div>
                                            </div>

                                            {/* Enemy Stats */}
                                            <div className="enemy-stats bg-gray-700 p-4 rounded-lg">
                                                <h3 className="text-lg font-bold mb-2">
                                                    {enemy.name}
                                                </h3>
                                                <div className="hp-bar bg-gray-900 w-full h-4 rounded-full">
                                                    <div
                                                        className="bg-red-500 h-4 rounded-full"
                                                        style={{
                                                            width: `${Math.max(
                                                                0,
                                                                (enemy.hp /
                                                                    enemy.max_hp) *
                                                                    100
                                                            )}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="mt-1">
                                                    HP: {enemy.hp} /{" "}
                                                    {enemy.max_hp}
                                                </div>
                                                <div>
                                                    Attack: {enemy.attack_min} -{" "}
                                                    {enemy.attack_max}
                                                </div>
                                                <div>
                                                    Defense: {enemy.defense}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Battle Visuals */}
                                    <div className="battle-visuals mb-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="player-visual flex justify-center">
                                                <div className="w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center">
                                                    <span className="text-2xl font-bold">
                                                        {player.name.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="enemy-visual flex justify-center">
                                                {enemy.image_path ? (
                                                    <img
                                                        src={enemy.image_path}
                                                        alt={enemy.name}
                                                        className="w-24 h-24 object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-24 h-24 bg-red-900 rounded-full flex items-center justify-center">
                                                        <span className="text-xl font-bold">
                                                            {enemy.name.charAt(
                                                                0
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message Box */}
                                    <div className="message-box p-4 bg-gray-900 rounded-lg mb-6 min-h-16">
                                        <pre className="whitespace-pre-wrap text-gray-300">
                                            {message}
                                        </pre>
                                    </div>

                                    {/* Level Up Dialog */}
                                    {showLevelUp && (
                                        <div className="level-up-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                                            <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
                                                <h3 className="text-xl font-bold text-purple-400 mb-4">
                                                    Level Up!
                                                </h3>
                                                <p className="mb-4">
                                                    You've advanced to level{" "}
                                                    {level + 1}! Choose one stat
                                                    to upgrade:
                                                </p>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        onClick={() =>
                                                            handleLevelUp(
                                                                "max_hp"
                                                            )
                                                        }
                                                        className="bg-green-700 hover:bg-green-600 py-3 px-4 rounded text-sm"
                                                    >
                                                        <span className="block font-bold mb-1">
                                                            HP +20
                                                        </span>
                                                        <span className="text-xs">
                                                            Current:{" "}
                                                            {
                                                                currentPlayer.max_hp
                                                            }
                                                        </span>
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleLevelUp(
                                                                "attack"
                                                            )
                                                        }
                                                        className="bg-red-700 hover:bg-red-600 py-3 px-4 rounded text-sm"
                                                    >
                                                        <span className="block font-bold mb-1">
                                                            Attack +2/3
                                                        </span>
                                                        <span className="text-xs">
                                                            Current:{" "}
                                                            {
                                                                currentPlayer.attack_min
                                                            }
                                                            -
                                                            {
                                                                currentPlayer.attack_max
                                                            }
                                                        </span>
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleLevelUp(
                                                                "defense"
                                                            )
                                                        }
                                                        className="bg-blue-700 hover:bg-blue-600 py-3 px-4 rounded text-sm"
                                                    >
                                                        <span className="block font-bold mb-1">
                                                            Defense +2
                                                        </span>
                                                        <span className="text-xs">
                                                            Current:{" "}
                                                            {
                                                                currentPlayer.defense
                                                            }
                                                        </span>
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleLevelUp(
                                                                "heal"
                                                            )
                                                        }
                                                        className="bg-purple-700 hover:bg-purple-600 py-3 px-4 rounded text-sm"
                                                    >
                                                        <span className="block font-bold mb-1">
                                                            Heal +5
                                                        </span>
                                                        <span className="text-xs">
                                                            Current:{" "}
                                                            {currentPlayer.heal}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    {gameOver ? (
                                        <div className="game-over-screen p-4 bg-gray-700 rounded-lg text-center">
                                            <h3 className="text-xl font-bold mb-4 text-yellow-400">
                                                {victory
                                                    ? "Victory!"
                                                    : "Defeat!"}
                                            </h3>
                                            <p className="mb-4">
                                                {victory
                                                    ? "You've defeated the enemy! Continue your journey."
                                                    : "You have been defeated. Try again?"}
                                            </p>
                                            <div className="flex justify-center space-x-4">
                                                {victory && !showLevelUp && (
                                                    <button
                                                        onClick={startBattle}
                                                        className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                                                    >
                                                        Continue to Next Battle
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() =>
                                                        router.visit(
                                                            route(
                                                                "player.dashboard"
                                                            )
                                                        )
                                                    }
                                                    className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                                >
                                                    Return to Dashboard
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="action-buttons grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-gray-700 rounded-lg">
                                            <button
                                                onClick={() =>
                                                    performAction("attack")
                                                }
                                                className="bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={loading}
                                            >
                                                Attack
                                            </button>
                                            <button
                                                onClick={() =>
                                                    performAction("defend")
                                                }
                                                className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={loading}
                                            >
                                                Defend
                                            </button>
                                            <button
                                                onClick={() =>
                                                    performAction("heal")
                                                }
                                                className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={
                                                    loading ||
                                                    currentPlayer.hp ===
                                                        currentPlayer.max_hp
                                                }
                                            >
                                                Heal
                                            </button>
                                            <button
                                                onClick={() =>
                                                    performAction("skill")
                                                }
                                                className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={
                                                    loading ||
                                                    currentBattleState.skillUses <=
                                                        0
                                                }
                                            >
                                                Skill (
                                                {currentBattleState.skillUses})
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center p-4">
                                    <p className="mb-4">
                                        No enemies available. Please try again
                                        later.
                                    </p>
                                    <button
                                        onClick={() =>
                                            router.visit(
                                                route("player.dashboard")
                                            )
                                        }
                                        className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Return to Dashboard
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
