'use client';
import React, { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import BrowseByCategory from "./BrowseByCategory";
import WhyTechyBlog from "./WhyTechyBlog";
import LatestBlogs from "./LatestBlogs";
import WhatWeDo from "./WhatWeDo";
import WriteBlogCTA from "./WriteBlogCTA";
import BlogPopup from "./BlogPopup";

import {
    FaLaptopCode,
    FaHeartbeat,
    FaFilm,
    FaGamepad,
    FaGlobeAsia,
    FaMicroscope,
    FaChalkboardTeacher,
    FaPlaneDeparture,
    FaRobot,
    FaCoins,
    FaUserAlt,
    FaRocket,
    FaBriefcase,
    FaFutbol
} from "react-icons/fa";

export default function Home({ blogs }) {
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // Icon mapping for categories
    const categoryIcons = {
        'Technology': <FaLaptopCode />,
        'Health': <FaHeartbeat />,
        'Entertainment': <FaFilm />,
        'Gaming': <FaGamepad />,
        'World': <FaGlobeAsia />,
        'Science': <FaMicroscope />,
        'Education': <FaChalkboardTeacher />,
        'Travel': <FaPlaneDeparture />,
        'AI': <FaRobot />,
        'Finance': <FaCoins />,
        'Lifestyle': <FaUserAlt />,
        'Startups': <FaRocket />,
        'Business': <FaBriefcase />,
        'Sports': <FaFutbol />
    };

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`);
                if (response.ok) {
                    const result = await response.json();

                    if (result.success && result.data) {
                        // Map API categories to component format with icons
                        const mappedCategories = result.data.map(category => ({
                            name: category.name,
                            href: `/${category.slug || category.name.toLowerCase().replace(/\s+/g, "-")}`,
                            icon: categoryIcons[category.name] || <FaLaptopCode />, // Default icon
                            _id: category._id,
                            description: category.description
                        }));

                        setCategories(mappedCategories);
                        console.log('📋 Home categories loaded:', mappedCategories);
                    }
                } else {
                    console.error('Failed to fetch categories for home page');
                }
            } catch (error) {
                console.error('Error fetching categories for home page:', error);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <>
            {/* <BlogPopup /> */}
            <HeroSection />
            <LatestBlogs />
            <WhyTechyBlog />
            <WhatWeDo />
            <WriteBlogCTA />
            {categoriesLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading categories...</p>
                </div>
            ) : (
                <BrowseByCategory categories={categories} />
            )}
        </>
    );
}
