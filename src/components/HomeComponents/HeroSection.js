import React from "react";
import Link from "next/link";

const HeroSection = () => {
    return (
        <section className="relative w-full flex flex-col items-center justify-center text-center py-24 px-4 bg-[url('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center">
            <div className="relative z-10 max-w-3xl mx-auto glass p-10">
                <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow animate-fade-in-up mb-6">
                    Explore Knowledge, Inspire Change
                </h1>
                <p className="text-xl md:text-2xl text-neutral-800 mb-8 animate-fade-in-up delay-100 bg-white/60 p-2 rounded-xl shadow">
                    Science, technology, business, cinema, sports, gaming, healthcare, and more—discover the world with{" "}
                    <span className="font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                        techyblog
                    </span>.
                </p>
                <Link
                    href="/contact"
                    className="inline-block bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-transform animate-fade-in-up delay-200"
                >
                    Start Your Journey
                </Link>
            </div>
        </section>
    );
};

export default HeroSection;
