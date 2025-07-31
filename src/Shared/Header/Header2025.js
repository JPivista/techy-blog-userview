"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showCategoriesPopup, setShowCategoriesPopup] = useState(false);
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

    const toggleCategoriesPopup = () => {
        setShowCategoriesPopup(!showCategoriesPopup);
    };

    const closeCategoriesPopup = () => {
        setShowCategoriesPopup(false);
    };

    // Show only first 3 categories in desktop header
    const visibleCategories = categories.slice(0, 6);
    const remainingCategories = categories.slice(6);

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
                <nav className="hidden md:flex flex-wrap gap-4 text-sm font-medium items-center">
                    {categoriesLoading ? (
                        <div className="text-gray-500">Loading categories...</div>
                    ) : (
                        <>
                            {/* First 3 categories */}
                            {visibleCategories.map((category) => {
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
                            })}

                            {/* View More Categories Button */}
                            {remainingCategories.length > 0 && (
                                <div className="relative">
                                    <button
                                        onClick={toggleCategoriesPopup}
                                        className="flex items-center gap-1 text-purple-600 hover:text-purple-800 font-semibold transition pb-1"
                                    >
                                        More Categories
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform ${showCategoriesPopup ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {/* Categories Popup */}
                                    {showCategoriesPopup && (
                                        <>
                                            {/* Backdrop */}
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={closeCategoriesPopup}
                                            />

                                            {/* Popup Content */}
                                            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48 py-2">
                                                <div className="px-4 py-2 border-b border-gray-100">
                                                    <h3 className="text-sm font-semibold text-gray-700">
                                                        All Categories
                                                    </h3>
                                                </div>
                                                <div className="max-h-64 overflow-y-auto">
                                                    {remainingCategories.map((category) => {
                                                        const slug = `/${category.slug || category.name.toLowerCase().replace(/\s+/g, "-")}`;
                                                        const isActive = pathname === slug;

                                                        return (
                                                            <Link
                                                                key={category._id}
                                                                href={slug}
                                                                onClick={closeCategoriesPopup}
                                                                className={`block px-4 py-2 text-sm hover:bg-gray-50 transition ${isActive
                                                                    ? "text-purple-600 font-semibold bg-purple-50"
                                                                    : "text-gray-700"
                                                                    }`}
                                                            >
                                                                {category.name}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </>
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
