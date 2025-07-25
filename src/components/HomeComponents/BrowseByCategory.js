import React from "react";
import CategoryCard from "./CategoryCard";

const BrowseByCategory = ({ categories }) => {
    return (
        <section className="w-full py-12 px-4">
            <h2 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400">
                Browse by Category
            </h2>
            <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                {categories.map((cat, index) => (
                    <CategoryCard key={cat.name} {...cat} index={index} />
                ))}
            </div>
        </section>
    );
};

export default BrowseByCategory;
