import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard({ auth }) {
    const [loading, setLoading] = useState(true);
    const [enemy, setEnemy] = useState(null);
    const [player, setPlayer] = useState({
        hp: 100,
        max_hp: 100,
        attack: 15,
        defense: 5,
    });
    const [battleState, setBattleState] = useState({
        isDefending: false,
        skillUses: 3,
        battleLog: [],
    });
    const [message, setMessage] = useState("");
    const [gameOver, setGameOver] = useState(false);
    const [victory, setVictory] = useState(false);

    // Load a random enemy when component mounts
    useEffect(() => {
        loadRandomEnemy();
    }, []);

    const loadRandomEnemy = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/enemies/random");
            setEnemy(response.data.enemy);

            // Reset battle state
            setBattleState({
                isDefending: false,
                skillUses: 3,
                battleLog: [],
            });

            // Reset player HP for new battle
            setPlayer((prevPlayer) => ({
                ...prevPlayer,
                hp: prevPlayer.max_hp,
            }));

            setGameOver(false);
            setVictory(false);
            setMessage("A new battle begins!");
            setLoading(false);
        } catch (error) {
            console.error("Error loading enemy:", error);
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
                player,
                enemy,
                battleState,
            });

            setPlayer(response.data.player);
            setEnemy(response.data.enemy);
            setBattleState(response.data.battleState);
            setMessage(response.data.message);

            if (response.data.gameOver) {
                setGameOver(true);
                setVictory(response.data.victory);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error processing action:", error);
            setMessage("Error processing action. Please try again.");
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Battle Arena
                </h2>
            }
        >
            <Head title="Battle Arena" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {loading ? (
                                <div className="text-center p-4">
                                    Loading battle...
                                </div>
                            ) : enemy ? (
                                <div className="battle-screen">
                                    {/* Battle Status */}
                                    <div className="battle-status mb-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            {/* Player Stats */}
                                            <div className="player-stats">
                                                <h3 className="text-lg font-bold mb-2">
                                                    Player
                                                </h3>
                                                <div className="hp-bar bg-gray-200 w-full h-4 rounded-full">
                                                    <div
                                                        className="bg-green-500 h-4 rounded-full"
                                                        style={{
                                                            width: `${Math.max(
                                                                0,
                                                                (player.hp /
                                                                    player.max_hp) *
                                                                    100
                                                            )}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="mt-1">
                                                    HP: {player.hp} /{" "}
                                                    {player.max_hp}
                                                </div>
                                                <div>
                                                    Attack: {player.attack}
                                                </div>
                                                <div>
                                                    Defense: {player.defense}
                                                </div>
                                            </div>

                                            {/* Enemy Stats */}
                                            <div className="enemy-stats">
                                                <h3 className="text-lg font-bold mb-2">
                                                    {enemy.name}
                                                </h3>
                                                <div className="hp-bar bg-gray-200 w-full h-4 rounded-full">
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
                                                    Attack: {enemy.attack}
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
                                                {/* Player character image could go here */}
                                                <div className="w-24 h-24 bg-blue-300 rounded-full flex items-center justify-center">
                                                    Player
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
                                                    <div className="w-24 h-24 bg-red-300 rounded-full flex items-center justify-center">
                                                        {enemy.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message Box */}
                                    <div className="message-box p-4 bg-gray-100 rounded-lg mb-6 min-h-16">
                                        <pre className="whitespace-pre-wrap">
                                            {message}
                                        </pre>
                                    </div>

                                    {/* Action Buttons */}
                                    {gameOver ? (
                                        <div className="game-over-screen text-center">
                                            <h3 className="text-xl font-bold mb-4">
                                                {victory
                                                    ? "Victory!"
                                                    : "Defeat!"}
                                            </h3>
                                            <button
                                                onClick={loadRandomEnemy}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                disabled={loading}
                                            >
                                                New Battle
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="action-buttons grid grid-cols-2 md:grid-cols-4 gap-2">
                                            <button
                                                onClick={() =>
                                                    performAction("attack")
                                                }
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                disabled={loading}
                                            >
                                                Attack
                                            </button>
                                            <button
                                                onClick={() =>
                                                    performAction("defend")
                                                }
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                disabled={loading}
                                            >
                                                Defend
                                            </button>
                                            <button
                                                onClick={() =>
                                                    performAction("heal")
                                                }
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                                disabled={loading}
                                            >
                                                Heal
                                            </button>
                                            <button
                                                onClick={() =>
                                                    performAction("skill")
                                                }
                                                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                                                disabled={
                                                    loading ||
                                                    battleState.skillUses <= 0
                                                }
                                            >
                                                Skill ({battleState.skillUses})
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="mb-4">
                                        No enemies available. Please ask an
                                        admin to create some!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
