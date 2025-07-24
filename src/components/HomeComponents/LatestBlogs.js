'use client'
import React, { useEffect, useState } from 'react'

const LatestBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs`);
                if (!response.ok) throw new Error('Failed to fetch blogs');

                const data = await response.json();
                setBlogs(data.blogs || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (isLoading) return <div className="text-center text-lg mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">Error: {error}</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Latest Blog Posts</h2>

            {blogs.length === 0 ? (
                <p className="text-center text-gray-500">No blogs available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                        <div key={blog._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
                            <h3 className="text-xl font-semibold mb-2 text-blue-600">{blog.title}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-3">{blog.description}</p>
                            <p className="text-sm text-gray-400">
                                {blog.publishedDate
                                    ? new Date(blog.publishedDate).toLocaleDateString()
                                    : 'No Date'}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                By: {blog?.createdBy?.name || 'Unknown'}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LatestBlogs;
