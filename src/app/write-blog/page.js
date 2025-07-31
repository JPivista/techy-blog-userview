'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    FaPen,
    FaLightbulb,
    FaUsers,
    FaStar,
    FaRocket,
    FaHeart,
    FaArrowRight,
    FaCheckCircle,
    FaBookOpen,
    FaGlobe,
    FaTrophy,
    FaGift
} from 'react-icons/fa';

const WriteBlogPage = () => {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    const benefits = [
        {
            icon: <FaUsers className="text-4xl text-blue-500" />,
            title: "Reach Thousands",
            description: "Share your knowledge with our growing community of readers"
        },
        {
            icon: <FaStar className="text-4xl text-yellow-500" />,
            title: "Build Authority",
            description: "Establish yourself as an expert in your field"
        },
        {
            icon: <FaGlobe className="text-4xl text-green-500" />,
            title: "Global Exposure",
            description: "Your content reaches readers worldwide"
        },
        {
            icon: <FaTrophy className="text-4xl text-purple-500" />,
            title: "Win Recognition",
            description: "Get featured and recognized for your contributions"
        }
    ];

    const features = [
        "No technical knowledge required",
        "Free to submit",
        "Professional editing support",
        "SEO optimization included",
        "Social media promotion",
        "Author profile page"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 px-4">
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-pulse"></div>
                        <div className="absolute top-40 right-20 w-16 h-16 bg-pink-400/20 rounded-full animate-pulse delay-1000"></div>
                        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-400/20 rounded-full animate-pulse delay-500"></div>
                    </div>

                    {/* Main Content */}
                    <div className="mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full mb-6 animate-bounce">
                            <FaPen className="text-3xl text-white" />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 drop-shadow-lg">
                            Write Your Story
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Share your expertise, experiences, and insights with the world.
                            Your voice matters, and your story deserves to be heard.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <button
                                onClick={() => router.push('/write-your-blog')}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white font-bold rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 transform"
                            >
                                <span className="flex items-center gap-2">
                                    Start Writing Now
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

                        {/* Stats */}
                        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-400 mb-2">500+</div>
                                <div className="text-gray-300">Published Authors</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-pink-400 mb-2">10K+</div>
                                <div className="text-gray-300">Articles Published</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-400 mb-2">100K+</div>
                                <div className="text-gray-300">Monthly Readers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
                                <div className="text-gray-300">Categories</div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-6 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
                        Why Write With Us?
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105"
                            >
                                <div className="mb-4 flex justify-center">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-300">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 bg-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
                        What You Get
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                            >
                                <FaCheckCircle className="text-green-400 text-xl flex-shrink-0" />
                                <span className="text-white">{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Final CTA */}
                    <div className="bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-yellow-400/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8">
                        <div className="flex items-center justify-center mb-4">
                            <FaGift className="text-4xl text-yellow-400 mr-4" />
                            <h3 className="text-2xl font-bold text-white">
                                Ready to Share Your Story?
                            </h3>
                        </div>
                        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                            Join thousands of authors who are already sharing their knowledge and building their audience.
                            Start your writing journey today!
                        </p>
                        <button
                            onClick={() => router.push('/write-your-blog')}
                            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white font-bold rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 transform"
                        >
                            <span className="flex items-center gap-2">
                                <FaRocket className="text-xl" />
                                Start Writing Now
                                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-2" />
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <FaHeart className="text-2xl text-red-400 animate-pulse" />
                        <span className="text-white text-lg">Your voice matters to us</span>
                        <FaHeart className="text-2xl text-red-400 animate-pulse" />
                    </div>
                    <p className="text-gray-300 mb-6">
                        Don&apos;t wait - start sharing your knowledge today and make a difference in someone&apos;s life.
                    </p>
                    <Link
                        href="/write-your-blog"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
                    >
                        <FaBookOpen />
                        Begin Your Writing Journey
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default WriteBlogPage; 