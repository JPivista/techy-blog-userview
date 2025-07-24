import React from "react";
import Link from "next/link";

const CategoryCard = ({ name, href, icon }) => {
    return (
        <Link
            href={href}
            className="glass rounded-3xl shadow-xl p-10 flex flex-col items-center hover:scale-105 transition-transform border-t-4 border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
            <span className="text-5xl mb-4">{icon}</span>
            <h3 className="text-2xl font-bold mb-2 text-neutral-800">{name}</h3>
            <p className="text-gray-600 text-center">Explore the latest in {name.toLowerCase()}.</p>
        </Link>
    );
};

export default CategoryCard;
