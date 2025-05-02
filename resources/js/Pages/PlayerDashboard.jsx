import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

export default function PlayerDashboard({ auth, playerProfile, maxLevel }) {
    const [hasNameError, setHasNameError] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: playerProfile?.name || "",
    });

    const handleNameSubmit = (e) => {
        e.preventDefault();

        if (!data.name.trim()) {
            setHasNameError(true);
            return;
        }

        post(route("player.updateName"), {
            preserveScroll: true,
        });
    };

    const startGame = () => {
        if (!playerProfile?.name) {
            setHasNameError(true);
            return;
        }

        window.location.href = route("player.startGame");
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Player Dashboard
                </h2>
            }
        >
            <Head title="Player Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex flex-col md:flex-row md:space-x-8">
                                {/* Left column: Character info */}
                                <div className="w-full md:w-1/2 mb-6 md:mb-0">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Character Profile
                                    </h3>

                                    {/* Character name form */}
                                    <form
                                        onSubmit={handleNameSubmit}
                                        className="mb-6"
                                    >
                                        <div>
                                            <InputLabel
                                                htmlFor="name"
                                                value="Character Name"
                                            />
                                            <TextInput
                                                id="name"
                                                name="name"
                                                value={data.name}
                                                className="mt-1 block w-full"
                                                onChange={(e) => {
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    );
                                                    setHasNameError(false);
                                                }}
                                                required
                                            />
                                            <InputError
                                                message={errors.name}
                                                className="mt-2"
                                            />
                                            {hasNameError && (
                                                <p className="text-sm text-red-600 mt-2">
                                                    You must create a character
                                                    name before playing.
                                                </p>
                                            )}
                                            <div className="mt-2">
                                                <PrimaryButton
                                                    type="submit"
                                                    disabled={processing}
                                                >
                                                    Save Name
                                                </PrimaryButton>
                                            </div>
                                        </div>
                                    </form>

                                    {/* Character stats */}
                                    {playerProfile && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold mb-2">
                                                Character Stats
                                            </h4>
                                            <ul className="space-y-1">
                                                <li>
                                                    Current Level:{" "}
                                                    {
                                                        playerProfile.current_level
                                                    }
                                                </li>
                                                <li>
                                                    Max HP:{" "}
                                                    {playerProfile.max_hp}
                                                </li>
                                                <li>
                                                    Attack:{" "}
                                                    {playerProfile.attack_min} -{" "}
                                                    {playerProfile.attack_max}
                                                </li>
                                                <li>
                                                    Defense:{" "}
                                                    {playerProfile.defense}
                                                </li>
                                                <li>
                                                    Heal: {playerProfile.heal}
                                                </li>
                                                <li>
                                                    Highest Level Reached:{" "}
                                                    {maxLevel}
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Right column: Actions */}
                                <div className="w-full md:w-1/2">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Game Options
                                    </h3>

                                    <div className="space-y-4">
                                        <div
                                            className="p-4 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100 transition cursor-pointer"
                                            onClick={startGame}
                                        >
                                            <h4 className="font-bold text-red-700 text-lg mb-1">
                                                Play Game
                                            </h4>
                                            <p className="text-sm text-red-600">
                                                Enter the dungeon and battle
                                                through{" "}
                                                {maxLevel > 0
                                                    ? `level ${playerProfile.current_level}`
                                                    : "level 1"}
                                                . How far can you go?
                                            </p>
                                            {!playerProfile?.name && (
                                                <p className="text-xs text-red-500 mt-2 italic">
                                                    You need to set a character
                                                    name first.
                                                </p>
                                            )}
                                        </div>

                                        <Link
                                            href={route("leaderboard")}
                                            className="block p-4 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition"
                                        >
                                            <h4 className="font-bold text-purple-700 text-lg mb-1">
                                                Leaderboard
                                            </h4>
                                            <p className="text-sm text-purple-600">
                                                See the top players and their
                                                highest levels reached.
                                            </p>
                                        </Link>

                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            as="div"
                                            className="block p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                                        >
                                            <h4 className="font-bold text-gray-700 text-lg mb-1">
                                                Quit Game
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Log out from your account.
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
