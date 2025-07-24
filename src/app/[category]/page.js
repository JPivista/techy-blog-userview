import React from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getBlogs() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch blogs');
    }

    const data = await res.json();
    return data.blogs || [];
}

const CategoryPage = async ({ params }) => {
    const { category } = params;
    const blogs = await getBlogs();

    const filteredBlogs = blogs.filter((blog) =>
        blog.subcategories?.some(
            (sub) => sub.name.toLowerCase() === category.toLowerCase()
        )
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-4xl font-bold text-center mb-8 capitalize">
                {category} Blogs
            </h1>

            {filteredBlogs.length === 0 ? (
                <p className="text-center text-gray-500">No blogs available in this category.</p>
            ) : (
                <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                    {filteredBlogs.map((blog) => (
                        <div
                            key={blog._id}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col"
                        >
                            {/* Image or fallback */}
                            {blog.image ? (
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-48 object-cover"
                                />
                            ) : (
                                <div className="w-full h-48 flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 shadow-lg">
                                    techyblog
                                </div>
                            )}

                            {/* Blog content */}
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-lg font-semibold text-blue-700 mb-2 line-clamp-2">
                                    {blog.title}
                                </h3>
                                <div
                                    className="text-gray-600 text-sm mb-4 line-clamp-3"
                                    dangerouslySetInnerHTML={{ __html: blog.description }}
                                />
                                <div className="text-xs text-gray-400 mt-auto flex justify-between">
                                    <span>{new Date(blog.publishedDate).toLocaleDateString()}</span>
                                    <span>By: {blog?.createdBy?.name || 'Unknown'}</span>
                                </div>
                                {/* Read More */}
                                <Link
                                    href={`/${category.toLowerCase()}/${blog.slug}`}
                                    className="mt-4 text-sm font-semibold text-purple-600 hover:text-purple-800 transition"
                                >
                                    Read More →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
