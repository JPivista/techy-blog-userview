import React from "react";
import HeroSection from "./HeroSection";
import BrowseByCategory from "./BrowseByCategory";
import WhyTechyBlog from "./WhyTechyBlog";
import LatestBlogs from "./LatestBlogs";
import WhatWeDo from "./WhatWeDo";

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
    FaRocket
} from "react-icons/fa";

export default function Home({ blogs }) {
    const categories = [
        { name: "Technology", href: "/technology", icon: <FaLaptopCode /> },
        { name: "Health", href: "/health", icon: <FaHeartbeat /> },
        { name: "Entertainment", href: "/entertainment", icon: <FaFilm /> },
        { name: "Gaming", href: "/gaming", icon: <FaGamepad /> },
        { name: "World", href: "/world", icon: <FaGlobeAsia /> },
        { name: "Science", href: "/science", icon: <FaMicroscope /> },
        { name: "Education", href: "/education", icon: <FaChalkboardTeacher /> },
        { name: "Travel", href: "/travel", icon: <FaPlaneDeparture /> },
        { name: "AI", href: "/ai", icon: <FaRobot /> },
        { name: "Finance", href: "/finance", icon: <FaCoins /> },
        { name: "Lifestyle", href: "/lifestyle", icon: <FaUserAlt /> },
        { name: "Startups", href: "/startups", icon: <FaRocket /> },
    ];

    return (
        <>
            <HeroSection />
            <LatestBlogs />
            <WhyTechyBlog />
            <WhatWeDo />
            <BrowseByCategory categories={categories} />
        </>
    );
}
