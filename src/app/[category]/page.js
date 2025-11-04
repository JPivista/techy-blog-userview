import React from 'react';
import CategoryBlogList from './CategoryBlogList';

export const dynamic = 'force-dynamic';

// Generate metadata for the category page
export async function generateMetadata({ params }) {
    const { category } = params;

    // Configure your full domain here
    const fullDomain = process.env.NEXT_PUBLIC_FULL_DOMAIN || 'https://techy-blog.com';

    try {
        // Fetch category metadata from WordPress
        const categoryRes = await fetch(
            `https://docs.techy-blog.com/wp-json/wp/v2/categories?slug=${category}`,
            { cache: 'no-store' }
        );

        if (categoryRes.ok) {
            const categories = await categoryRes.json();
            if (categories.length > 0) {
                const foundCategory = categories[0];
                return {
                    title: `${foundCategory.name} Blogs - TechyBlog`,
                    description: foundCategory.description 
                        ? foundCategory.description.replace(/<[^>]*>/g, '').substring(0, 160)
                        : `Explore the latest ${foundCategory.name} blogs, articles, and insights. Discover trending topics and expert knowledge in ${foundCategory.name.toLowerCase()}.`,
                    keywords: `${foundCategory.name}, blogs, articles, ${foundCategory.name.toLowerCase()}, techyblog`,
                    openGraph: {
                        title: `${foundCategory.name} Blogs - TechyBlog`,
                        description: foundCategory.description 
                            ? foundCategory.description.replace(/<[^>]*>/g, '').substring(0, 160)
                            : `Explore the latest ${foundCategory.name} blogs and articles.`,
                        type: 'website',
                        url: `${fullDomain}/${category}`,
                    },
                    twitter: {
                        card: 'summary_large_image',
                        title: `${foundCategory.name} Blogs - TechyBlog`,
                        description: foundCategory.description 
                            ? foundCategory.description.replace(/<[^>]*>/g, '').substring(0, 160)
                            : `Explore the latest ${foundCategory.name} blogs and articles.`,
                    }
                };
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

export default async function CategoryPage({ params }) {
    const { category } = params;

    return <CategoryBlogList categorySlug={category} />;
}