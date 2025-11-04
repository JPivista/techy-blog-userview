'use client';
import React, { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import BrowseByCategory from "./BrowseByCategory";
import WhyTechyBlog from "./WhyTechyBlog";
import LatestBlogs from "./LatestBlogs";
import AllBlogs from "./AllBlogs";
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

    // Fetch categories from WordPress
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://docs.techy-blog.com/wp-json/wp/v2/categories?per_page=100');
                if (response.ok) {
                    const wpCategories = await response.json();

                    // Filter out uncategorized and transform to component format
                    const mappedCategories = wpCategories
                        .filter(cat => cat.slug !== 'uncategorized' && cat.name !== 'Uncategorized')
                        .map(category => ({
                            name: category.name,
                            href: `/${category.slug}`,
                            icon: categoryIcons[category.name] || <FaLaptopCode />, // Default icon
                            _id: category.id.toString(),
                            description: category.description
                        }));

                    setCategories(mappedCategories);
                } else {
                    console.error('Failed to fetch categories from WordPress');
                }
            } catch (error) {
                console.error('Error fetching categories from WordPress:', error);
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
            {/* <AllBlogs /> */}
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
