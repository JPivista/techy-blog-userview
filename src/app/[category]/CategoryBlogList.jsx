'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogImageUrl } from '../../utils/imageUtils';

const BLOGS_PER_PAGE = 9;

async function fetchWordPressCategory(categorySlug) {
    try {
        const response = await fetch(
            `https://docs.techy-blog.com/wp-json/wp/v2/categories?slug=${categorySlug}`,
            { cache: 'no-store' }
        );
        if (!response.ok) return null;
        const categories = await response.json();
        return categories.length > 0 ? categories[0] : null;
    } catch (error) {
        console.error('Error fetching WordPress category:', error);
        return null;
    }
}

async function fetchWordPressTags(tagIds) {
    if (!tagIds || tagIds.length === 0) return [];
    try {
        const ids = tagIds.join(',');
        const response = await fetch(
            `https://docs.techy-blog.com/wp-json/wp/v2/tags?include=${ids}`,
            { cache: 'no-store' }
        );
        if (!response.ok) return [];
        const tags = await response.json();
        // Return array of tag names
        return tags.map(tag => tag.name);
    } catch (error) {
        console.error('Error fetching WordPress tags:', error);
        return [];
    }
}

async function fetchWordPressBlogs(categoryId, page = 1, perPage = 100) {
    try {
        const response = await fetch(
            `https://docs.techy-blog.com/wp-json/wp/v2/posts?categories=${categoryId}&per_page=${perPage}&page=${page}&status=publish&_embed=true`,
            { cache: 'no-store' }
        );
        if (!response.ok) return [];
        const wpPosts = await response.json();

        // Transform WordPress posts to match expected blog structure
        const blogs = await Promise.all(wpPosts.map(async (wpPost) => {
            const featuredImage = wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
            const wpCategories = wpPost._embedded?.['wp:term']?.[0] || [];

            // Fetch tags to get tag names
            const wpTagNames = await fetchWordPressTags(wpPost.tags || []);

            // Fetch post_author_name from ACF or meta fields, fallback to embedded author
            const postAuthorName = wpPost.acf?.post_author_name ||
                wpPost.meta?.post_author_name ||
                wpPost._embedded?.author?.[0]?.name ||
                'Unknown Author';

            return {
                _id: wpPost.id.toString(),
                title: wpPost.title?.rendered || '',
                description: wpPost.content?.rendered || '',
                slug: wpPost.slug,
                status: wpPost.status,
                publishedDate: wpPost.date,
                updatedAt: wpPost.modified,
                authorName: postAuthorName,
                banner: featuredImage,
                thumbnail: featuredImage,
                categoryIds: wpCategories.map(cat => ({
                    _id: cat.id.toString(),
                    name: cat.name,
                    slug: cat.slug
                })),
                tags: wpTagNames || []
            };
        }));

        return blogs;
    } catch (error) {
        console.error('Error fetching WordPress blogs:', error);
        return [];
    }
}

export default function CategoryBlogList({ categorySlug }) {
    const [blogs, setBlogs] = useState([]);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [displayedCount, setDisplayedCount] = useState(BLOGS_PER_PAGE);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // Fetch category info
                const category = await fetchWordPressCategory(categorySlug);
                setCategoryInfo(category);

                if (category) {
                    // Fetch all blogs for this category
                    const allBlogs = await fetchWordPressBlogs(category.id);
                    setBlogs(allBlogs);
                }
            } catch (error) {
                console.error('Error loading category data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [categorySlug]);

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        // Simulate loading delay for better UX
        setTimeout(() => {
            setDisplayedCount(prev => prev + BLOGS_PER_PAGE);
            setIsLoadingMore(false);
        }, 300);
    };

    const displayedBlogs = blogs.slice(0, displayedCount);
    const hasMore = displayedCount < blogs.length;

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading blogs...</p>
                </div>
            </div>
        );
    }

    if (blogs.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">No blogs available in this category yet.</p>
                    <p className="text-gray-400">Check back soon for new content!</p>
                </div>
            </div>
        );
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
                        {categoryInfo?.name || categorySlug}
                    </li>
                </ul>
            </nav>

            {/* Category Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 capitalize">
                    {categoryInfo?.name || categorySlug} Blogs
                </h1>
                {categoryInfo?.description && (
                    <p
                        className="text-gray-600 text-lg max-w-3xl mx-auto"
                        dangerouslySetInnerHTML={{ __html: categoryInfo.description }}
                    />
                )}
            </div>

            {/* Blog Grid */}
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                {displayedBlogs.map((blog) => (
                    <div
                        key={blog._id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col h-full"
                    >
                        {getBlogImageUrl(blog) ? (
                            <div className="relative w-full h-48">
                                <Image
                                    src={getBlogImageUrl(blog)}
                                    alt={blog.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        ) : (
                            <div className="w-full h-48 flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 shadow-lg">
                                {blog.categoryIds?.[0]?.name || 'TechyBlog'}
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
                                        {blog.publishedDate ? new Date(blog.publishedDate).toLocaleDateString() : 'No Date'}
                                    </span>
                                    <span>By: {blog?.authorName || 'Unknown'}</span>
                                </div>
                                <Link
                                    href={`/${blog.categoryIds?.[0]?.slug || categorySlug}/${blog.slug}`}
                                    className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition"
                                >
                                    Read More →
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="text-center mt-8">
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoadingMore ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                Loading...
                            </span>
                        ) : (
                            `Load More (${blogs.length - displayedCount} remaining)`
                        )}
                    </button>
                </div>
            )}

            {/* Blog Count */}
            <div className="text-center mt-8 text-gray-500">
                Showing {displayedBlogs.length} of {blogs.length} {blogs.length === 1 ? 'blog' : 'blogs'} in {categoryInfo?.name || categorySlug}
            </div>
        </div>
    );
}
