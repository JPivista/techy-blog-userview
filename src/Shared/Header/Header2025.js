"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // you can also use heroicons or react-icons

const categories = [
    "Science", "Technology", "Business", "Cinema", "Sports", "Gaming",
    "Healthcare", "Education", "Politics", "Lifestyle", "Travel",
    "Environment", "Food", "Fashion", "Finance", "History", "Law & Government"
];

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="w-full bg-white shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400">
                    techyblog
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex flex-wrap gap-4 text-sm font-medium">
                    {categories.slice(0, 6).map((cat) => (
                        <Link
                            key={cat}
                            href={`/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                            className="text-gray-700 hover:text-purple-600 transition"
                        >
                            {cat}
                        </Link>
                    ))}
                    <Link href="/contact" className="text-purple-600 font-semibold hover:underline ml-2">
                        Contact Us
                    </Link>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-gray-700 focus:outline-none"
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden px-4 pb-4">
                    <nav className="flex flex-col gap-2 text-sm font-medium border-t border-gray-200 pt-4">
                        {categories.map((cat) => (
                            <Link
                                key={cat}
                                href={`/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                                className="text-gray-700 hover:text-purple-600 transition"
                                onClick={() => setIsOpen(false)}
                            >
                                {cat}
                            </Link>
                        ))}
                        <Link
                            href="/contact"
                            className="text-purple-600 font-semibold hover:underline mt-2"
                            onClick={() => setIsOpen(false)}
                        >
                            Contact Us
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
