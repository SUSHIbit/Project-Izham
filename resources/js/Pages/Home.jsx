import React from 'react';
import { Link, Head } from '@inertiajs/react';

export default function Home({ canLogin, canRegister }) {
    return (
        <>
            <Head title="Dungeon RPG" />
            <div className="relative min-h-screen bg-gray-900 text-white">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-repeat opacity-10" 
                     style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
                
                {/* Navigation */}
                <div className="p-6 flex justify-end">
                    {canLogin ? (
                        <div className="space-x-4">
                            {canRegister && (
                                <Link
                                    href={route('register')}
                                    className="px-4 py-2 bg-purple-800 hover:bg-purple-700 text-white rounded-lg transition"
                                >
                                    Register
                                </Link>
                            )}
                            <Link
                                href={route('login')}
                                className="px-4 py-2 bg-indigo-800 hover:bg-indigo-700 text-white rounded-lg transition"
                            >
                                Login
                            </Link>
                        </div>
                    ) : (
                        <Link
                            href={route('dashboard')}
                            className="px-4 py-2 bg-green-800 hover:bg-green-700 text-white rounded-lg transition"
                        >
                            Dashboard
                        </Link>
                    )}
                </div>

                {/* Main content */}
                <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-center mb-8 text-purple-300 drop-shadow-lg">
                        Survive the 100 Levels
                    </h1>
                    
                    <div className="w-64 h-64 mb-12 flex justify-center">
                        <div className="w-full h-full rounded-full bg-purple-900/50 flex items-center justify-center overflow-hidden border-4 border-purple-700/50">
                            {/* Monster silhouette */}
                            <div className="w-3/4 h-3/4 bg-red-800/70 rounded-full flex items-center justify-center">
                                <svg 
                                    viewBox="0 0 24 24" 
                                    className="w-3/4 h-3/4 text-red-500" 
                                    fill="currentColor"
                                >
                                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,10.5A1.5,1.5 0 0,0 10.5,12A1.5,1.5 0 0,0 12,13.5A1.5,1.5 0 0,0 13.5,12A1.5,1.5 0 0,0 12,10.5M7.5,10.5A1.5,1.5 0 0,0 6,12A1.5,1.5 0 0,0 7.5,13.5A1.5,1.5 0 0,0 9,12A1.5,1.5 0 0,0 7.5,10.5M16.5,10.5A1.5,1.5 0 0,0 15,12A1.5,1.5 0 0,0 16.5,13.5A1.5,1.5 0 0,0 18,12A1.5,1.5 0 0,0 16.5,10.5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <p className="text-lg md:text-xl text-center max-w-2xl mb-12 text-gray-300">
                        Embark on a perilous journey through 100 levels of dungeon madness. 
                        Battle fearsome enemies, upgrade your skills, and see how far you can go 
                        before the darkness claims you. Will you reach the final level and become a legend?
                    </p>
                    
                    <Link
                        href={canLogin ? route('login') : route('dashboard')}
                        className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white text-xl font-bold rounded-lg transition transform hover:scale-105 hover:shadow-lg"
                    >
                        Play Game
                    </Link>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Dungeon RPG - Brave the depths, conquer the shadows
                </div>
            </div>
        </>
    );
}