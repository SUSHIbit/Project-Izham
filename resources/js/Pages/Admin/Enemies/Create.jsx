import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";

export default function Index({ auth, enemiesByGroup, levelGroups }) {
    function deleteEnemy(id) {
        if (confirm("Are you sure you want to delete this enemy?")) {
            router.delete(route("admin.enemies.destroy", id));
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manage Enemies
                </h2>
            }
        >
            <Head title="Manage Enemies" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between mb-6">
                                <h3 className="text-lg font-semibold">
                                    Enemy Management
                                </h3>
                                <Link
                                    href={route("admin.enemies.create")}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                                >
                                    Create New Enemy
                                </Link>
                            </div>

                            {Object.keys(enemiesByGroup).length > 0 ? (
                                <div>
                                    {Object.keys(enemiesByGroup)
                                        .sort((a, b) => a - b)
                                        .map((levelGroup) => (
                                            <div
                                                key={levelGroup}
                                                className="mb-10"
                                            >
                                                <h4 className="text-md font-semibold bg-gray-100 p-2 rounded-t-lg">
                                                    {levelGroups[levelGroup] ||
                                                        `Level Group ${levelGroup}`}
                                                </h4>
                                                <div className="overflow-x-auto border border-gray-200 rounded-b-lg">
                                                    <table className="min-w-full bg-white">
                                                        <thead>
                                                            <tr className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
                                                                <th className="py-3 px-4 text-left">
                                                                    Name
                                                                </th>
                                                                <th className="py-3 px-4 text-left">
                                                                    HP
                                                                </th>
                                                                <th className="py-3 px-4 text-left">
                                                                    Attack
                                                                </th>
                                                                <th className="py-3 px-4 text-left">
                                                                    Defense
                                                                </th>
                                                                <th className="py-3 px-4 text-left">
                                                                    Image
                                                                </th>
                                                                <th className="py-3 px-4 text-left">
                                                                    Actions
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-gray-600 text-sm">
                                                            {enemiesByGroup[
                                                                levelGroup
                                                            ].map((enemy) => (
                                                                <tr
                                                                    key={
                                                                        enemy.id
                                                                    }
                                                                    className="border-t border-gray-200 hover:bg-gray-50"
                                                                >
                                                                    <td className="py-3 px-4">
                                                                        {
                                                                            enemy.name
                                                                        }
                                                                    </td>
                                                                    <td className="py-3 px-4">
                                                                        {
                                                                            enemy.hp
                                                                        }
                                                                    </td>
                                                                    <td className="py-3 px-4">
                                                                        {
                                                                            enemy.attack_min
                                                                        }{" "}
                                                                        -{" "}
                                                                        {
                                                                            enemy.attack_max
                                                                        }
                                                                    </td>
                                                                    <td className="py-3 px-4">
                                                                        {
                                                                            enemy.defense
                                                                        }
                                                                    </td>
                                                                    <td className="py-3 px-4">
                                                                        {enemy.image_path && (
                                                                            <img
                                                                                src={`/storage/${enemy.image_path}`}
                                                                                alt={
                                                                                    enemy.name
                                                                                }
                                                                                className="w-12 h-12 object-cover rounded"
                                                                            />
                                                                        )}
                                                                    </td>
                                                                    <td className="py-3 px-4">
                                                                        <div className="flex space-x-2">
                                                                            <Link
                                                                                href={route(
                                                                                    "admin.enemies.edit",
                                                                                    enemy.id
                                                                                )}
                                                                                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-700 text-white rounded text-xs"
                                                                            >
                                                                                Edit
                                                                            </Link>
                                                                            <button
                                                                                onClick={() =>
                                                                                    deleteEnemy(
                                                                                        enemy.id
                                                                                    )
                                                                                }
                                                                                className="px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded text-xs"
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="bg-gray-50 p-4 rounded text-center">
                                    No enemies found. Create your first enemy!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
