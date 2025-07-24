import React from "react";
import CategoryCard from "./CategoryCard";

const BrowseByCategory = ({ categories }) => {
    return (
        <section className="w-full max-w-6xl mx-auto py-20 px-4">
            <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent mb-12">
                Browse by Category
            </h2>
            <div className="grid md:grid-cols-3 gap-10">
                {categories.map((cat) => (
                    <CategoryCard key={cat.name} {...cat} />
                ))}
            </div>
        </section>
    );
};

export default BrowseByCategory;
