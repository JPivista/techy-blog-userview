import React from 'react';
import Link from 'next/link';

export async function generateMetadata({ params }) {
    const { category, slug } = params;
    return {
        title: `${slug} | ${category}`,
    };
}

async function getBlog(slug) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${slug}`);
    if (!res.ok) return null;
    const blog = await res.json();
    return blog;
}

async function getAllBlogs() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs`, {
        cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.blogs || [];
}

export default async function BlogDetailsPage({ params }) {
    const { category, slug } = params;

    const blog = await getBlog(slug);
    const allBlogs = await getAllBlogs();

    if (!blog) return <div className="text-center text-red-600 mt-10">Blog not found</div>;

    // Filter related blogs: same subcategory, not the current blog
    const relatedBlogs = allBlogs.filter(
        (b) =>
            b._id !== blog._id &&
            b.subcategories?.some(
                (sub) => blog.subcategories?.some((s) => s.name === sub.name)
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
                                {category.replace(/-/g, ' ')}
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="text-gray-700 capitalize line-clamp-1">{slug.replace(/-/g, ' ')}</li>
                    </ol>
                </nav>

                <h1 className="text-4xl font-bold mb-4 text-purple-700">{blog.title}</h1>
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
                            {related.image ? (
                                <img
                                    src={related.image}
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
