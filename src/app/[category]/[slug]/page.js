import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogImageUrl, getBlogBannerUrl } from '../../../utils/imageUtils';

async function fetchWordPressPost(slug) {
    try {
        const response = await fetch(
            `https://docs.techy-blog.com/wp-json/wp/v2/posts?slug=${slug}&_embed=true`,
            { cache: 'no-store' }
        );
        if (!response.ok) return null;
        const posts = await response.json();
        return posts.length > 0 ? posts[0] : null;
    } catch (error) {
        console.error('Error fetching WordPress post:', error);
        return null;
    }
}

async function fetchWordPressCategories(categoryIds) {
    if (!categoryIds || categoryIds.length === 0) return [];
    try {
        const ids = categoryIds.join(',');
        const response = await fetch(
            `https://docs.techy-blog.com/wp-json/wp/v2/categories?include=${ids}`,
            { cache: 'no-store' }
        );
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error('Error fetching WordPress categories:', error);
        return [];
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

export async function generateMetadata({ params }) {
    const { category, slug } = params;

    // Configure your full domain here
    const fullDomain = process.env.NEXT_PUBLIC_FULL_DOMAIN || 'https://techy-blog.com';

    try {
        // Fetch blog data from WordPress
        const wpPost = await fetchWordPressPost(slug);

        if (wpPost) {
            // Fetch categories to get category names
            const wpCategories = await fetchWordPressCategories(wpPost.categories || []);

            // Extract featured image from _embedded
            const featuredImage = wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

            // Extract meta title and description from meta or ACF fields
            const metaTitle = wpPost.meta?.meta_title ||
                wpPost.acf?.meta_title ||
                wpPost.title?.rendered ||
                `${slug.replace(/-/g, ' ')} | ${category}`;

            const metaDescription = wpPost.meta?.meta_description ||
                wpPost.acf?.meta_description ||
                (wpPost.excerpt?.rendered ?
                    wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160) :
                    `Read the latest blog post about ${category} - ${wpPost.title?.rendered || slug.replace(/-/g, ' ')}`);

            // Get category name for better SEO
            const categoryName = wpCategories[0]?.name || category;
            // Fetch post_author_name from ACF or meta fields, fallback to embedded author
            const authorName = wpPost.acf?.post_author_name ||
                wpPost.meta?.post_author_name ||
                wpPost._embedded?.author?.[0]?.name ||
                'Unknown Author';

            return {
                title: metaTitle,
                description: metaDescription,
                keywords: `${categoryName}, ${wpTagNames?.join(', ') || ''}, blog, article, ${authorName}`,
                openGraph: {
                    title: metaTitle,
                    description: metaDescription,
                    type: 'article',
                    url: `${fullDomain}/${category}/${slug}`,
                    siteName: 'TechyBlog',
                    authors: [authorName],
                    publishedTime: wpPost.date,
                    modifiedTime: wpPost.modified,
                    section: categoryName,
                    tags: wpTagNames || [],
                    images: featuredImage ? [
                        {
                            url: featuredImage,
                            width: 1200,
                            height: 630,
                            alt: wpPost.title?.rendered || '',
                        }
                    ] : [],
                },
                twitter: {
                    card: 'summary_large_image',
                    title: metaTitle,
                    description: metaDescription,
                    images: featuredImage ? [featuredImage] : [],
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
        const wpPost = await fetchWordPressPost(slug);
        if (!wpPost || wpPost.status !== 'publish') return null;

        // Fetch categories to get category names
        const wpCategories = await fetchWordPressCategories(wpPost.categories || []);

        // Fetch tags to get tag names
        const wpTagNames = await fetchWordPressTags(wpPost.tags || []);

        // Extract featured image from _embedded
        const featuredImage = wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

        // Fetch post_author_name from ACF or meta fields, fallback to embedded author
        const postAuthorName = wpPost.acf?.post_author_name ||
            wpPost.meta?.post_author_name ||
            wpPost._embedded?.author?.[0]?.name ||
            'Unknown Author';

        // Transform WordPress post to match expected blog structure
        const blog = {
            _id: wpPost.id.toString(),
            title: wpPost.title?.rendered || '',
            description: wpPost.content?.rendered || '',
            slug: wpPost.slug,
            status: wpPost.status,
            publishedDate: wpPost.date,
            updatedAt: wpPost.modified,
            authorName: postAuthorName,
            banner: featuredImage, // Use featured image as banner
            thumbnail: featuredImage, // Use featured image as thumbnail
            metaTitle: wpPost.meta?.meta_title || wpPost.acf?.meta_title || wpPost.title?.rendered,
            metaDescription: wpPost.meta?.meta_description || wpPost.acf?.meta_description ||
                (wpPost.excerpt?.rendered ? wpPost.excerpt.rendered.replace(/<[^>]*>/g, '') : ''),
            categoryIds: wpCategories.map(cat => ({
                _id: cat.id.toString(),
                name: cat.name,
                slug: cat.slug
            })),
            tags: wpTagNames || []
        };

        return blog;
    } catch (error) {
        console.error('Error fetching blog:', error);
        return null;
    }
}

async function getAllBlogs() {
    try {
        const response = await fetch(
            'https://docs.techy-blog.com/wp-json/wp/v2/posts?per_page=100&_embed=true&status=publish',
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
            b.status === 'publish' &&
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
                            <Link href={`/${blog.categoryIds?.[0]?.slug || category}`} className="hover:underline text-purple-600 capitalize">
                                {blog.categoryIds?.[0]?.name || category.replace(/-/g, ' ')}
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="text-gray-700 capitalize line-clamp-1">{blog.title}</li>
                    </ol>
                </nav>

                {/* Blog Banner Image */}
                {getBlogBannerUrl(blog) && (
                    <div className="mb-6">
                        <img
                            src={getBlogBannerUrl(blog)}
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
                            {getBlogImageUrl(related) ? (
                                <img
                                    src={getBlogImageUrl(related)}
                                    alt={related.title}
                                    className="w-full h-32 object-cover rounded-t-md"
                                />
                            ) : (
                                <div className="w-full h-32 flex items-center justify-center text-lg font-bold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400">
                                    {related.categoryIds?.[0]?.name || 'TechyBlog'}
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
                                    href={`/${related.categoryIds?.[0]?.slug || category}/${related.slug}`}
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
