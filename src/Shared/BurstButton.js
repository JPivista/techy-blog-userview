'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    FaPen,
    FaRocket,
    FaStar,
    FaFire,
    FaGem
} from 'react-icons/fa';

const BurstButton = () => {
    const router = useRouter();
    const [isBursting, setIsBursting] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        setIsBursting(true);
        // Redirect immediately after burst animation starts
        setTimeout(() => {
            router.push('/write-your-blog');
        }, 300);
    };

    return (
        <div className="relative inline-block">
            {/* Burst Animation Container */}
            <div className={`absolute inset-0 transition-all duration-500 ${isBursting ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
                }`}>
                {/* Burst Rays */}
                <div className={`absolute inset-0 transition-all duration-500 ${isBursting ? 'animate-ping' : ''
                    }`}>
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-30"></div>
                </div>

                {/* Multiple Burst Layers */}
                <div className={`absolute inset-0 transition-all duration-700 ${isBursting ? 'scale-200 opacity-0' : 'scale-100 opacity-100'
                    }`}>
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 opacity-20"></div>
                </div>

                <div className={`absolute inset-0 transition-all duration-1000 ${isBursting ? 'scale-250 opacity-0' : 'scale-100 opacity-100'
                    }`}>
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-green-400 to-yellow-400 opacity-15"></div>
                </div>
            </div>

            {/* Main Button */}
            <button
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white font-bold rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 transform hover:shadow-xl overflow-hidden ${isBursting ? 'animate-pulse' : ''
                    }`}
            >
                {/* Sparkle Effects */}
                <div className="absolute top-2 left-2 animate-spin">
                    <FaGem className="text-yellow-300 text-sm" />
                </div>
                <div className="absolute top-3 right-3 animate-pulse">
                    <FaStar className="text-yellow-300 text-xs" />
                </div>
                <div className="absolute bottom-2 left-3 animate-bounce">
                    <FaFire className="text-orange-400 text-xs" />
                </div>
                <div className="absolute bottom-3 right-2 animate-spin">
                    <FaGem className="text-yellow-300 text-xs" />
                </div>

                {/* Button Content */}
                <span className="flex items-center gap-2 relative z-10">
                    <FaPen className="text-lg" />
                    Write Your Blog
                    <FaRocket className={`text-lg transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''
                        }`} />
                </span>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
            </button>

            {/* Click Burst Particles */}
            {isBursting && (
                <>
                    {/* Particle 1 */}
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                        style={{ animationDelay: '0ms', transform: 'translate(-50%, -50%)' }}></div>

                    {/* Particle 2 */}
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-pink-500 rounded-full animate-ping"
                        style={{ animationDelay: '100ms', transform: 'translate(-50%, -50%)' }}></div>

                    {/* Particle 3 */}
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-600 rounded-full animate-ping"
                        style={{ animationDelay: '200ms', transform: 'translate(-50%, -50%)' }}></div>

                    {/* Particle 4 */}
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-orange-500 rounded-full animate-ping"
                        style={{ animationDelay: '300ms', transform: 'translate(-50%, -50%)' }}></div>
                </>
            )}
        </div>
    );
};

export default BurstButton; 