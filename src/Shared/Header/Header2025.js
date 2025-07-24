"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react"; // Optional: can use heroicons/react-icons too

const categories = [
    "Science", "Technology", "Business", "Cinema", "Sports", "Gaming",
    "Healthcare", "Education", "Politics", "Lifestyle", "Travel",
    "Environment", "Food", "Fashion", "Finance", "History", "Law & Government"
];

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="w-full bg-white shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400"
                >
                    techyblog
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex flex-wrap gap-4 text-sm font-medium">
                    {categories.slice(0, 6).map((cat) => {
                        const slug = `/${cat.toLowerCase().replace(/\s+/g, "-")}`;
                        const isActive = pathname === slug;

                        return (
                            <Link
                                key={cat}
                                href={slug}
                                className={`${isActive
                                    ? "text-purple-600 font-semibold border-b-2 border-purple-600"
                                    : "text-gray-700"
                                    } hover:text-purple-600 transition pb-1`}
                            >
                                {cat}
                            </Link>
                        );
                    })}
                    <Link
                        href="/contact"
                        className={`ml-2 ${pathname === "/contact"
                            ? "text-purple-600 font-semibold underline"
                            : "text-purple-600"
                            } hover:underline`}
                    >
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

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden px-4 pb-4">
                    <nav className="flex flex-col gap-2 text-sm font-medium border-t border-gray-200 pt-4">
                        {categories.map((cat) => {
                            const slug = `/category/${cat.toLowerCase().replace(/\s+/g, "-")}`;
                            const isActive = pathname === slug;

                            return (
                                <Link
                                    key={cat}
                                    href={slug}
                                    onClick={() => setIsOpen(false)}
                                    className={`${isActive
                                        ? "text-purple-600 font-semibold"
                                        : "text-gray-700"
                                        } hover:text-purple-600 transition`}
                                >
                                    {cat}
                                </Link>
                            );
                        })}
                        <Link
                            href="/contact"
                            onClick={() => setIsOpen(false)}
                            className={`mt-2 ${pathname === "/contact"
                                ? "text-purple-600 font-semibold underline"
                                : "text-purple-600"
                                } hover:underline`}
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
