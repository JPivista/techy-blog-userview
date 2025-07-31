import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Generate metadata for the category page
export async function generateMetadata({ params }) {
    const { category } = params;

    // Configure your full domain here
    const fullDomain = process.env.NEXT_PUBLIC_FULL_DOMAIN || 'https://mydomain.com';

    try {
        // Fetch category metadata from backend
        const categoryRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`, {
            cache: 'no-store',
        });

        if (categoryRes.ok) {
            const categoryData = await categoryRes.json();

            if (categoryData.success && categoryData.data) {
                // Find the specific category
                const foundCategory = categoryData.data.find(
                    cat => cat.slug?.toLowerCase() === category.toLowerCase() ||
                        cat.name?.toLowerCase() === category.toLowerCase()
                );

                if (foundCategory) {
                    return {
                        title: foundCategory.metaTitle || `${foundCategory.name} Blogs - TechyBlog`,
                        description: foundCategory.metaDescription || `Explore the latest ${foundCategory.name} blogs, articles, and insights. Discover trending topics and expert knowledge in ${foundCategory.name.toLowerCase()}.`,
                        keywords: `${foundCategory.name}, blogs, articles, ${foundCategory.name.toLowerCase()}, techyblog`,
                        openGraph: {
                            title: foundCategory.metaTitle || `${foundCategory.name} Blogs - TechyBlog`,
                            description: foundCategory.metaDescription || `Explore the latest ${foundCategory.name} blogs and articles.`,
                            type: 'website',
                            url: `${fullDomain}/${category}`,
                        },
                        twitter: {
                            card: 'summary_large_image',
                            title: foundCategory.metaTitle || `${foundCategory.name} Blogs - TechyBlog`,
                            description: foundCategory.metaDescription || `Explore the latest ${foundCategory.name} blogs and articles.`,
                        }
                    };
                }
            }
        }
    } catch (error) {
        console.error('Error fetching category metadata:', error);
    }

    // Fallback metadata
    return {
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Blogs - TechyBlog`,
        description: `Explore the latest ${category} blogs, articles, and insights. Discover trending topics and expert knowledge.`,
        keywords: `${category}, blogs, articles, techyblog`,
    };
}

async function getCategoryBlogs(category) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs`, {
            cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to fetch blogs');

        const data = await res.json();
        const allBlogs = data.blogs || [];

        // Filter by main categories
        const matchingBlogs = allBlogs.filter((blog) =>
            blog.categoryIds?.some(
                (cat) => cat.name.toLowerCase() === category.toLowerCase()
            )
        );

        return { blogs: matchingBlogs, isValid: matchingBlogs.length > 0 };
    } catch (error) {
        console.error('Error fetching category blogs:', error);
        return { blogs: [], isValid: false };
    }
}

async function getCategoryInfo(category) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`, {
            cache: 'no-store',
        });

        if (res.ok) {
            const data = await res.json();
            if (data.success && data.data) {
                return data.data.find(
                    cat => cat.slug?.toLowerCase() === category.toLowerCase() ||
                        cat.name?.toLowerCase() === category.toLowerCase()
                );
            }
        }
    } catch (error) {
        console.error('Error fetching category info:', error);
    }

    return null;
}

export default async function CategoryPage({ params }) {
    const { category } = params;

    // Fetch category info and blogs
    const [categoryInfo, { blogs, isValid }] = await Promise.all([
        getCategoryInfo(category),
        getCategoryBlogs(category)
    ]);

    if (!isValid) {
        notFound();
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            {/* Breadcrumbs */}
            <nav className="text-sm text-gray-500 mb-4">
                <ul className="flex items-center gap-2">
                    <li>
                        <Link href="/" className="hover:underline text-purple-600">
                            Home
                        </Link>
                    </li>
                    <li>/</li>
                    <li className="text-gray-700 capitalize line-clamp-1">
                        {categoryInfo?.name || category}
                    </li>
                </ul>
            </nav>

            {/* Category Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 capitalize">
                    {categoryInfo?.name || category} Blogs
                </h1>
                {categoryInfo?.description && (
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        {categoryInfo.description}
                    </p>
                )}
            </div>

            {blogs.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">No blogs available in this category yet.</p>
                    <p className="text-gray-400">Check back soon for new content!</p>
                </div>
            ) : (
                <>
                    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                        {blogs.map((blog) => (
                            <div
                                key={blog._id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col h-full"
                            >
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

                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-lg font-semibold text-blue-700 mb-2 line-clamp-2 min-h-[3.5rem]">
                                        {blog.title}
                                    </h3>
                                    <div
                                        className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[4.5rem]"
                                        dangerouslySetInnerHTML={{ __html: blog.description }}
                                    />

                                    <div className="mt-auto">
                                        <div className="text-xs text-gray-400 mb-2 flex justify-between">
                                            <span>
                                                {new Date(blog.publishedDate).toLocaleDateString()}
                                            </span>
                                            <span>By: {blog?.authorName || 'Unknown'}</span>
                                        </div>
                                        <Link
                                            href={`/${category.toLowerCase()}/${blog.slug}`}
                                            className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition"
                                        >
                                            Read More →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Blog Count */}
                    <div className="text-center mt-8 text-gray-500">
                        Showing {blogs.length} {blogs.length === 1 ? 'blog' : 'blogs'} in {categoryInfo?.name || category}
                    </div>
                </>
            )}
        </div>
    );
}