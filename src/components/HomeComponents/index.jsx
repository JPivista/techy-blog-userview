import React from "react";
import HeroSection from "./HeroSection";
import BrowseByCategory from "./BrowseByCategory";
import WhyTechyBlog from "./WhyTechyBlog";
import LatestBlogs from "./LatestBlogs";

import {
    FaLaptopCode,
    FaHeartbeat,
    FaFilm,
    FaGamepad,
    FaGlobe,
    FaMicroscope
} from "react-icons/fa";


export default function Home({ blogs }) {
    const categories = [
        { name: "Technology", href: "/technology", icon: <FaLaptopCode /> },
        { name: "Health", href: "/health", icon: <FaHeartbeat /> },
        { name: "Entertainment", href: "/entertainment", icon: <FaFilm /> },
        { name: "Gaming", href: "/gaming", icon: <FaGamepad /> },
        { name: "World", href: "/world", icon: <FaGlobe /> },
        { name: "Science", href: "/science", icon: <FaMicroscope /> },
    ];
    return (
        <>
            <HeroSection />
            <BrowseByCategory categories={categories} />
            <WhyTechyBlog />
            <LatestBlogs />
        </>
    );
}
