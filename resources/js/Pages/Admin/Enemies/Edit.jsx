import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

export default function Edit({ auth, enemy }) {
    const { data, setData, post, processing, errors } = useForm({
        name: enemy.name || "",
        hp: enemy.hp || "",
        attack: enemy.attack || "",
        defense: enemy.defense || "",
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

                                <div className="mb-4">
                                    <InputLabel
                                        htmlFor="attack"
                                        value="Attack"
                                    />
                                    <TextInput
                                        id="attack"
                                        type="number"
                                        name="attack"
                                        value={data.attack}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData("attack", e.target.value)
                                        }
                                        required
                                        min="1"
                                    />
                                    <InputError
                                        message={errors.attack}
                                        className="mt-2"
                                    />
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
