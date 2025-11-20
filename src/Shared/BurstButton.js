'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    FaEdit,
    FaPaperPlane,
    FaStar,
    FaMagic,
    FaFeather,
    FaRocket,
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
        }, 400);
    };

    return (
        <div className="relative inline-block">
            {/* Enhanced Burst Animation Container */}
            <div className={`absolute inset-0 transition-all duration-700 ${isBursting ? 'scale-200 opacity-0' : 'scale-100 opacity-100'
                }`}>
                {/* Rotating Burst Rays */}
                <div className={`absolute inset-0 transition-all duration-700 ${isBursting ? 'rotate-180 scale-150 opacity-0' : 'rotate-0 scale-100 opacity-100'
                    }`}>
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-40 animate-spin-slow"></div>
                </div>

                {/* Expanding Rings */}
                <div className={`absolute inset-0 transition-all duration-800 ${isBursting ? 'scale-250 opacity-0' : 'scale-100 opacity-100'
                    }`}>
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 opacity-30"></div>
                </div>

                <div className={`absolute inset-0 transition-all duration-1000 ${isBursting ? 'scale-300 opacity-0' : 'scale-100 opacity-100'
                    }`}>
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 opacity-20"></div>
                </div>
            </div>

            {/* Main Button */}
            <button
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`relative px-10 py-5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 text-white font-bold rounded-3xl shadow-2xl hover:scale-110 transition-all duration-300 transform hover:shadow-2xl overflow-hidden ${isBursting ? 'animate-pulse scale-105' : ''
                    }`}
                style={{
                    background: isHovered 
                        ? 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #7c3aed 100%)'
                        : 'linear-gradient(135deg, #0891b2 0%, #2563eb 50%, #6d28d9 100%)'
                }}
            >
                {/* Animated Background Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>

                {/* Enhanced Sparkle Effects */}
                <div className="absolute top-1 left-3 animate-spin" style={{ animationDuration: '3s' }}>
                    <FaStar className="text-cyan-300 text-base" />
                </div>
                <div className="absolute top-2 right-4 animate-pulse" style={{ animationDelay: '0.5s' }}>
                    <FaGem className="text-blue-300 text-sm" />
                </div>
                <div className="absolute bottom-2 left-4 animate-bounce" style={{ animationDuration: '2s' }}>
                    <FaMagic className="text-purple-300 text-sm" />
                </div>
                <div className="absolute bottom-1 right-3 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
                    <FaStar className="text-cyan-300 text-xs" />
                </div>
                <div className="absolute top-1/2 left-1 animate-pulse">
                    <FaFeather className="text-white/60 text-xs" />
                </div>
                <div className="absolute top-1/2 right-1 animate-pulse" style={{ animationDelay: '1s' }}>
                    <FaFeather className="text-white/60 text-xs" />
                </div>

                {/* Button Content */}
                <span className="flex items-center gap-3 relative z-10">
                    <FaEdit className={`text-xl transition-all duration-300 ${isHovered ? 'rotate-12 scale-110' : ''}`} />
                    <span className="text-lg">Write Your Blog</span>
                    <FaPaperPlane className={`text-lg transition-all duration-300 ${isHovered ? 'translate-x-2 translate-y-[-4px] rotate-12' : ''}`} />
                </span>

                {/* Enhanced Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
            </button>

            {/* Enhanced Click Burst Particles */}
            {isBursting && (
                <>
                    {/* Particle Burst with more variety */}
                    {[...Array(12)].map((_, i) => {
                        const angle = (i * 30) * (Math.PI / 180);
                        const distance = 60;
                        const x = Math.cos(angle) * distance;
                        const y = Math.sin(angle) * distance;
                        const colors = ['bg-cyan-400', 'bg-blue-500', 'bg-purple-600', 'bg-pink-500', 'bg-rose-500', 'bg-orange-500'];
                        const color = colors[i % colors.length];
                        
                        return (
                            <div
                                key={i}
                                className={`absolute top-1/2 left-1/2 w-3 h-3 ${color} rounded-full animate-ping`}
                                style={{
                                    animationDelay: `${i * 50}ms`,
                                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                                    animationDuration: '1s'
                                }}
                            ></div>
                        );
                    })}
                    
                    {/* Center Burst */}
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full animate-ping"
                        style={{ transform: 'translate(-50%, -50%)', animationDelay: '0ms' }}></div>
                </>
            )}
        </div>
    );
};

export default BurstButton; 