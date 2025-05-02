import React from "react";
import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function Leaderboard({ topPlayers, auth }) {
    return (
        <>
            <Head title="Leaderboard" />

            <div className="min-h-screen bg-gray-900 text-white flex flex-col">
                {/* Navigation */}
                <div className="p-6 flex justify-between">
                    <Link
                        href="/"
                        className="text-white hover:text-purple-300 flex items-center"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back to Homepage
                    </Link>

                    {auth.user ? (
                        <Link
                            href={route("player.dashboard")}
                            className="px-4 py-2 bg-purple-800 hover:bg-purple-700 text-white rounded-lg transition"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <div className="space-x-4">
                            <Link
                                href={route("login")}
                                className="px-4 py-2 bg-indigo-800 hover:bg-indigo-700 text-white rounded-lg transition"
                            >
                                Login
                            </Link>
                            <Link
                                href={route("register")}
                                className="px-4 py-2 bg-purple-800 hover:bg-purple-700 text-white rounded-lg transition"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>

                {/* Main content */}
                <div className="flex-grow container mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold text-center mb-12 text-purple-300">
                        Dungeon Heroes Leaderboard
                    </h1>

                    <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <div className="bg-purple-900 px-6 py-4">
                            <h2 className="text-xl font-bold">
                                Top Dungeon Delvers
                            </h2>
                        </div>

                        {topPlayers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Rank
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Hero
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Level Reached
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-600">
                                        {topPlayers.map((player, index) => (
                                            <tr
                                                key={player.id}
                                                className={
                                                    index < 3
                                                        ? "bg-gray-800/70"
                                                        : "bg-gray-800/30"
                                                }
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {index === 0 && (
                                                            <span className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold mr-2">
                                                                1
                                                            </span>
                                                        )}
                                                        {index === 1 && (
                                                            <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold mr-2">
                                                                2
                                                            </span>
                                                        )}
                                                        {index === 2 && (
                                                            <span className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-700 flex items-center justify-center text-black font-bold mr-2">
                                                                3
                                                            </span>
                                                        )}
                                                        {index > 2 && (
                                                            <span className="ml-2 text-gray-400">
                                                                {index + 1}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-white">
                                                        {player.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-300">
                                                        Level {player.max_level}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="px-6 py-12 text-center">
                                <p className="text-gray-400">
                                    No heroes have entered the dungeon yet!
                                </p>
                                <p className="mt-2 text-gray-500">
                                    Will you be the first?
                                </p>
                            </div>
                        )}

                        <div className="bg-gray-700 px-6 py-4 text-sm text-gray-400">
                            <p>
                                Heroes are ranked by the highest dungeon level
                                reached.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-auto p-4 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Dungeon RPG - Brave the
                    depths, conquer the shadows
                </div>
            </div>
        </>
    );
}
