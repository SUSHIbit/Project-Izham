import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

export default function Edit({ auth, enemy, levelGroups }) {
    const { data, setData, post, processing, errors } = useForm({
        name: enemy.name || "",
        hp: enemy.hp || "",
        attack_min: enemy.attack_min || "",
        attack_max: enemy.attack_max || "",
        defense: enemy.defense || "",
        level_group: enemy.level_group || "1",
        image: null,
        _method: "put",
    });

    const [imagePreview, setImagePreview] = useState(
        enemy.image_path ? `/storage/${enemy.image_path}` : null
    );

    function handleSubmit(e) {
        e.preventDefault();
        post(route("admin.enemies.update", enemy.id));
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        setData("image", file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Enemy
                </h2>
            }
        >
            <Head title="Edit Enemy" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form
                                onSubmit={handleSubmit}
                                className="max-w-md mx-auto"
                            >
                                <div className="mb-4">
                                    <InputLabel htmlFor="name" value="Name" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <InputLabel htmlFor="hp" value="HP" />
                                    <TextInput
                                        id="hp"
                                        type="number"
                                        name="hp"
                                        value={data.hp}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData("hp", e.target.value)
                                        }
                                        required
                                        min="1"
                                    />
                                    <InputError
                                        message={errors.hp}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <InputLabel
                                            htmlFor="attack_min"
                                            value="Min Attack"
                                        />
                                        <TextInput
                                            id="attack_min"
                                            type="number"
                                            name="attack_min"
                                            value={data.attack_min}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "attack_min",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            min="1"
                                        />
                                        <InputError
                                            message={errors.attack_min}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="attack_max"
                                            value="Max Attack"
                                        />
                                        <TextInput
                                            id="attack_max"
                                            type="number"
                                            name="attack_max"
                                            value={data.attack_max}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "attack_max",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            min="1"
                                        />
                                        <InputError
                                            message={errors.attack_max}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <InputLabel
                                        htmlFor="defense"
                                        value="Defense"
                                    />
                                    <TextInput
                                        id="defense"
                                        type="number"
                                        name="defense"
                                        value={data.defense}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData("defense", e.target.value)
                                        }
                                        required
                                        min="0"
                                    />
                                    <InputError
                                        message={errors.defense}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <InputLabel
                                        htmlFor="level_group"
                                        value="Level Group"
                                    />
                                    <select
                                        id="level_group"
                                        name="level_group"
                                        value={data.level_group}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) =>
                                            setData(
                                                "level_group",
                                                e.target.value
                                            )
                                        }
                                        required
                                    >
                                        {Object.entries(levelGroups).map(
                                            ([value, label]) => (
                                                <option
                                                    key={value}
                                                    value={value}
                                                >
                                                    {label}
                                                </option>
                                            )
                                        )}
                                    </select>
                                    <InputError
                                        message={errors.level_group}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <InputLabel
                                        htmlFor="image"
                                        value="Image (Optional)"
                                    />
                                    <input
                                        id="image"
                                        type="file"
                                        name="image"
                                        className="mt-1 block w-full"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                    <InputError
                                        message={errors.image}
                                        className="mt-2"
                                    />

                                    {imagePreview && (
                                        <div className="mt-2">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-32 h-32 object-cover rounded"
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                Current image. Upload a new one
                                                to replace.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-6">
                                    <Link
                                        href={route("admin.enemies.index")}
                                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                                        disabled={processing}
                                    >
                                        Update Enemy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
