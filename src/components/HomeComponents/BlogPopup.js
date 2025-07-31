'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    FaPen,
    FaTimes,
    FaRocket,
    FaStar,
    FaGift,
    FaFire,
    FaGem
} from 'react-icons/fa';

const BlogPopup = () => {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [isBursting, setIsBursting] = useState(false);

    useEffect(() => {
        // Show popup after 2 seconds
        const showTimer = setTimeout(() => {
            setIsVisible(true);
            setIsBursting(true);
        }, 2000);

        // Hide popup after 10 seconds
        const hideTimer = setTimeout(() => {
            setIsBursting(false);
            setTimeout(() => setIsVisible(false), 300);
        }, 10000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    const handleClose = () => {
        setIsBursting(false);
        setTimeout(() => setIsVisible(false), 300);
    };

    const handleWriteBlog = () => {
        router.push('/write-blog');
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isBursting ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={handleClose}
            />

            {/* Popup Container */}
            <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${isBursting ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                }`}>

                {/* Burst Effect */}
                <div className={`absolute inset-0 transition-all duration-500 ${isBursting ? 'animate-ping' : ''
                    }`}>
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-20"></div>
                </div>

                {/* Main Popup */}
                <div className="relative bg-gradient-to-br from-purple-900 via-pink-800 to-red-900 rounded-3xl shadow-2xl border-2 border-yellow-400 overflow-hidden min-w-[320px] max-w-[400px]">

                    {/* Sparkle Effects */}
                    <div className="absolute top-4 left-4 animate-spin">
                        <FaGem className="text-yellow-300 text-xl" />
                    </div>
                    <div className="absolute top-6 right-6 animate-pulse">
                        <FaStar className="text-yellow-300 text-lg" />
                    </div>
                    <div className="absolute bottom-6 left-6 animate-bounce">
                        <FaFire className="text-orange-400 text-lg" />
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors z-10"
                    >
                        <FaTimes className="text-xl" />
                    </button>

                    {/* Content */}
                    <div className="p-8 text-center relative z-10">

                        {/* Gift Icon */}
                        <div className="mb-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg animate-pulse">
                                <FaGift className="text-white text-2xl" />
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-white mb-2">
                            🎉 Special Offer! 🎉
                        </h3>

                        {/* Subtitle */}
                        <p className="text-yellow-300 font-semibold text-lg mb-4">
                            Write Your Free Blog
                        </p>

                        {/* Description */}
                        <p className="text-gray-200 text-sm mb-6 leading-relaxed">
                            Share your knowledge with thousands of readers!
                            <br />
                            <span className="text-yellow-300 font-semibold">100% FREE</span> - No hidden costs!
                        </p>

                        {/* Features */}
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                                <FaRocket className="text-green-400" />
                                <span>Reach Global Audience</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                                <FaStar className="text-yellow-400" />
                                <span>Build Your Authority</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                                <FaPen className="text-blue-400" />
                                <span>Easy Publishing</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={handleWriteBlog}
                            className="w-full py-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-300 transform hover:shadow-xl"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <FaPen />
                                Start Writing Now
                                <FaRocket />
                            </span>
                        </button>

                        {/* Timer */}
                        <div className="mt-4 text-xs text-gray-400">
                            This offer expires in <span className="text-yellow-300 font-bold">10 seconds</span>
                        </div>
                    </div>

                    {/* Bottom Sparkle */}
                    <div className="absolute bottom-2 right-2 animate-spin">
                        <FaGem className="text-yellow-300 text-sm" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogPopup; 