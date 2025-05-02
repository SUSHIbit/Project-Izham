import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";

export default function Index({ auth, enemies }) {
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
                                    Enemy List
                                </h3>
                                <Link
                                    href={route("admin.enemies.create")}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                                >
                                    Create New Enemy
                                </Link>
                            </div>

                            {enemies.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white">
                                        <thead>
                                            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                                                <th className="py-3 px-6 text-left">
                                                    ID
                                                </th>
                                                <th className="py-3 px-6 text-left">
                                                    Name
                                                </th>
                                                <th className="py-3 px-6 text-left">
                                                    HP
                                                </th>
                                                <th className="py-3 px-6 text-left">
                                                    Attack
                                                </th>
                                                <th className="py-3 px-6 text-left">
                                                    Defense
                                                </th>
                                                <th className="py-3 px-6 text-left">
                                                    Image
                                                </th>
                                                <th className="py-3 px-6 text-left">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-600 text-sm">
                                            {enemies.map((enemy) => (
                                                <tr
                                                    key={enemy.id}
                                                    className="border-b border-gray-200 hover:bg-gray-50"
                                                >
                                                    <td className="py-3 px-6">
                                                        {enemy.id}
                                                    </td>
                                                    <td className="py-3 px-6">
                                                        {enemy.name}
                                                    </td>
                                                    <td className="py-3 px-6">
                                                        {enemy.hp}
                                                    </td>
                                                    <td className="py-3 px-6">
                                                        {enemy.attack}
                                                    </td>
                                                    <td className="py-3 px-6">
                                                        {enemy.defense}
                                                    </td>
                                                    <td className="py-3 px-6">
                                                        {enemy.image_path && (
                                                            <img
                                                                src={`/storage/${enemy.image_path}`}
                                                                alt={enemy.name}
                                                                className="w-12 h-12 object-cover rounded"
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-6">
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
                            ) : (
                                <p>
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
