"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react"; // Optional: can use heroicons/react-icons too

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const pathname = usePathname();

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`);
                if (response.ok) {
                    const result = await response.json();

                    // Handle the response structure
                    if (result.success && result.data) {
                        setCategories(result.data);
                        console.log('📋 Header categories loaded:', result.data);
                    } else {
                        console.error('Invalid categories response structure');
                    }
                } else {
                    console.error('Failed to fetch categories for header');
                }
            } catch (error) {
                console.error('Error fetching categories for header:', error);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

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
                    {categoriesLoading ? (
                        <div className="text-gray-500">Loading categories...</div>
                    ) : (
                        categories.slice(0, 6).map((category) => {
                            const slug = `/${category.slug || category.name.toLowerCase().replace(/\s+/g, "-")}`;
                            const isActive = pathname === slug;

                            return (
                                <Link
                                    key={category._id}
                                    href={slug}
                                    className={`${isActive
                                        ? "text-purple-600 font-semibold border-b-2 border-purple-600"
                                        : "text-gray-700"
                                        } hover:text-purple-600 transition pb-1`}
                                >
                                    {category.name}
                                </Link>
                            );
                        })
                    )}
                    <Link
                        href="/contact-us"
                        className={`ml-2 ${pathname === "/contact-us"
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
                        {categoriesLoading ? (
                            <div className="text-gray-500">Loading categories...</div>
                        ) : (
                            categories.map((category) => {
                                const slug = `/${category.slug || category.name.toLowerCase().replace(/\s+/g, "-")}`;
                                const isActive = pathname === slug;

                                return (
                                    <Link
                                        key={category._id}
                                        href={slug}
                                        onClick={() => setIsOpen(false)}
                                        className={`${isActive
                                            ? "text-purple-600 font-semibold"
                                            : "text-gray-700"
                                            } hover:text-purple-600 transition`}
                                    >
                                        {category.name}
                                    </Link>
                                );
                            })
                        )}
                        <Link
                            href="/contact-us"
                            onClick={() => setIsOpen(false)}
                            className={`mt-2 ${pathname === "/contact-us"
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
