'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    FaPen,
    FaUsers,
    FaStar,
    FaRocket,
    FaArrowRight,
    FaLightbulb,
    FaGlobe,
    FaTrophy
} from 'react-icons/fa';

const WriteBlogCTA = () => {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    const highlights = [
        {
            icon: <FaUsers className="text-2xl text-blue-400" />,
            text: "Join 500+ Authors"
        },
        {
            icon: <FaStar className="text-2xl text-yellow-400" />,
            text: "Build Your Authority"
        },
        {
            icon: <FaGlobe className="text-2xl text-green-400" />,
            text: "Reach Global Audience"
        },
        {
            icon: <FaTrophy className="text-2xl text-purple-400" />,
            text: "Get Recognized"
        }
    ];

    return (
        <section className="relative overflow-hidden py-20 px-4">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/10 rounded-full animate-pulse"></div>
                <div className="absolute top-20 right-20 w-24 h-24 bg-pink-400/10 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-blue-400/10 rounded-full animate-pulse delay-500"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full mb-6 animate-bounce">
                        <FaPen className="text-2xl text-white" />
                    </div>

                    {/* Main Heading */}
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 drop-shadow-lg">
                        Share Your Knowledge
                    </h2>

                    {/* Subtitle */}
                    <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Have valuable insights to share? Join our community of writers and reach thousands of readers worldwide.
                        Your expertise can inspire and educate others.
                    </p>

                    {/* Highlights */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
                        {highlights.map((highlight, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center gap-2 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
                            >
                                {highlight.icon}
                                <span className="text-sm text-white font-medium text-center">
                                    {highlight.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                        <button
                            onClick={() => router.push('/write-blog')}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white font-bold rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 transform"
                        >
                            <span className="flex items-center gap-2">
                                <FaLightbulb className="text-xl" />
                                Start Writing Today
                                <FaArrowRight className={`transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`} />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
                        </button>

                        <Link
                            href="/contact-us"
                            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300"
                        >
                            Learn More
                        </Link>
                    </div>

                    {/* Features */}
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-yellow-400 mb-2">Free</div>
                            <div className="text-gray-300">No cost to submit your articles</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-pink-400 mb-2">Easy</div>
                            <div className="text-gray-300">Simple submission process</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-blue-400 mb-2">Fast</div>
                            <div className="text-gray-300">Quick review and publishing</div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <FaRocket className="text-2xl text-yellow-400 animate-pulse" />
                        <span className="text-white text-lg font-semibold">Ready to make an impact?</span>
                        <FaRocket className="text-2xl text-yellow-400 animate-pulse" />
                    </div>
                    <p className="text-gray-300 mb-6">
                        Your knowledge can change lives. Start writing and share your story with the world.
                    </p>
                    <Link
                        href="/write-blog"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        <FaPen />
                        Begin Your Writing Journey
                        <FaArrowRight />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default WriteBlogCTA; 