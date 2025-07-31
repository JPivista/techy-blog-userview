import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    const { category, slug } = params;

    // Configure your full domain here
    const fullDomain = process.env.NEXT_PUBLIC_FULL_DOMAIN || 'https://mydomain.com';

    try {
        // Fetch blog data from backend
        const blogRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${slug}`, {
            cache: 'no-store',
        });

        if (blogRes.ok) {
            const blog = await blogRes.json();

            if (blog) {
                // Use blog's metadata if available, otherwise generate fallback
                const title = blog.metaTitle || blog.title || `${slug.replace(/-/g, ' ')} | ${category}`;
                const description = blog.metaDescription ||
                    (blog.description ? blog.description.replace(/<[^>]*>/g, '').substring(0, 160) :
                        `Read the latest blog post about ${category} - ${blog.title || slug.replace(/-/g, ' ')}`);

                // Get category name for better SEO
                const categoryName = blog.categoryIds?.[0]?.name || category;
                const authorName = blog.authorName || 'Unknown Author';

                return {
                    title: title,
                    description: description,
                    keywords: `${categoryName}, ${blog.tags?.join(', ') || ''}, blog, article, ${authorName}`,
                    openGraph: {
                        title: title,
                        description: description,
                        type: 'article',
                        url: `${fullDomain}/${category}/${slug}`,
                        siteName: 'TechyBlog',
                        authors: [authorName],
                        publishedTime: blog.publishedDate,
                        modifiedTime: blog.updatedAt,
                        section: categoryName,
                        tags: blog.tags || [],
                        images: blog.banner ? [
                            {
                                url: `${process.env.NEXT_PUBLIC_API_BASE_URL}${blog.banner}`,
                                width: 1200,
                                height: 630,
                                alt: blog.title,
                            }
                        ] : [],
                    },
                    twitter: {
                        card: 'summary_large_image',
                        title: title,
                        description: description,
                        images: blog.banner ? [`${process.env.NEXT_PUBLIC_API_BASE_URL}${blog.banner}`] : [],
                        creator: authorName,
                    },
                    alternates: {
                        canonical: `${fullDomain}/${category}/${slug}`,
                    },
                    robots: {
                        index: true,
                        follow: true,
                        googleBot: {
                            index: true,
                            follow: true,
                            'max-video-preview': -1,
                            'max-image-preview': 'large',
                            'max-snippet': -1,
                        },
                    },
                };
            }
        }
    } catch (error) {
        console.error('Error fetching blog metadata:', error);
    }

    // Fallback metadata if blog not found or error
    return {
        title: `${slug.replace(/-/g, ' ')} | ${category} | TechyBlog`,
        description: `Read the latest blog post about ${category} - ${slug.replace(/-/g, ' ')}`,
        keywords: `${category}, blog, article`,
    };
}

async function getBlog(slug) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${slug}`, {
            cache: 'no-store',
        });
        if (!res.ok) return null;
        const blog = await res.json();

        // Only return published blogs
        if (blog && blog.status === 'published') {
            return blog;
        }
        return null;
    } catch (error) {
        console.error('Error fetching blog:', error);
        return null;
    }
}

async function getAllBlogs() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs`, {
            cache: 'no-store',
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.blogs || [];
    } catch (error) {
        console.error('Error fetching all blogs:', error);
        return [];
    }
}

export default async function BlogDetailsPage({ params }) {
    const { category, slug } = params;

    const blog = await getBlog(slug);
    const allBlogs = await getAllBlogs();

    if (!blog) {
        notFound();
    }

    // Filter related blogs: same category, not the current blog, only published
    const relatedBlogs = allBlogs.filter(
        (b) =>
            b._id !== blog._id &&
            b.status === 'published' &&
            b.categoryIds?.some(
                (cat) => blog.categoryIds?.some((blogCat) => blogCat.name === cat.name)
            )
    ).slice(0, 3); // limit to 3 related blogs

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Blog Content */}
            <div className="md:col-span-2">
                {/* Breadcrumbs */}
                <nav className="text-sm text-gray-500 mb-6">
                    <ol className="list-reset flex space-x-2 items-center">
                        <li>
                            <Link href="/" className="hover:underline text-purple-600">Home</Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link href={`/${category}`} className="hover:underline text-purple-600 capitalize">
                                {blog.categoryIds?.[0]?.name || category.replace(/-/g, ' ')}
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="text-gray-700 capitalize line-clamp-1">{blog.title}</li>
                    </ol>
                </nav>

                {/* Blog Banner Image */}
                {blog.banner && (
                    <div className="mb-6">
                        <img
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${blog.banner}`}
                            alt={blog.title}
                            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                        />
                    </div>
                )}

                <h1 className="text-4xl font-bold mb-4 text-purple-700">{blog.title}</h1>

                {/* Author and Date Information */}
                <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Author</span>
                            <span className="font-semibold text-purple-600">
                                {blog?.authorName || 'Unknown Author'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Published</span>
                            <span className="font-medium text-gray-700">
                                {blog?.publishedDate ? new Date(blog.publishedDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : 'No Date'}
                            </span>
                        </div>
                    </div>
                    {blog?.categoryIds?.[0]?.name && (
                        <div className="flex flex-col items-end">
                            <span className="text-sm text-gray-500">Category</span>
                            <span className="font-medium text-purple-600 capitalize">
                                {blog.categoryIds[0].name}
                            </span>
                        </div>
                    )}
                </div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div
                    className="text-gray-700 leading-7 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: blog.description }}
                />
            </div>

            {/* Related Blogs */}
            <aside className="space-y-6">
                <h3 className="text-xl font-semibold text-purple-600 border-b pb-2 mb-4">Related Blogs</h3>
                {relatedBlogs.length === 0 ? (
                    <p className="text-sm text-gray-400">No related blogs found.</p>
                ) : (
                    relatedBlogs.map((related) => (
                        <div
                            key={related._id}
                            className="bg-white rounded-md shadow-sm hover:shadow-md transition"
                        >
                            {related.banner ? (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${related.banner}`}
                                    alt={related.title}
                                    className="w-full h-32 object-cover rounded-t-md"
                                />
                            ) : (
                                <div className="w-full h-32 flex items-center justify-center text-lg font-bold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400">
                                    techyblog
                                </div>
                            )}
                            <div className="p-3">
                                <h4 className="font-semibold text-base line-clamp-2">
                                    {related.title}
                                </h4>
                                <p
                                    className="text-sm text-gray-600 mt-2 line-clamp-3"
                                    dangerouslySetInnerHTML={{ __html: related.description }}
                                />
                                <Link
                                    href={`/${category}/${related.slug}`}
                                    className="text-xs text-purple-600 mt-2 inline-block hover:underline"
                                >
                                    Read More →
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </aside>
        </div>
    );
}
