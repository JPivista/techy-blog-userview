// Dynamic sitemap that fetches latest data from WordPress on each request

// Force dynamic rendering - always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Get base URL from environment variable or use default
const getBaseUrl = () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    return isDevelopment
        ? (process.env.NEXT_PUBLIC_FULL_DOMAIN || 'http://localhost:3000')
        : (process.env.NEXT_PUBLIC_FULL_DOMAIN || 'https://techy-blog.com');
};

// Get WordPress API URL from environment variable or use default
const getWordPressApiUrl = () => {
    return process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://docs.techy-blog.com/wp-json/wp/v2';
};

// Helper function to format date for sitemap
function formatDate(date) {
    if (!date) return new Date().toISOString().split('T')[0];
    try {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return new Date().toISOString().split('T')[0];
        }
        return dateObj.toISOString().split('T')[0];
    } catch (error) {
        return new Date().toISOString().split('T')[0];
    }
}

// Helper function to escape XML
function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

// Generate XML sitemap content
function generateSitemapXml(urls) {
    const urlEntries = urls.map(url => {
        const loc = escapeXml(url.url);
        const lastmod = formatDate(url.lastModified);
        const changefreq = url.changeFrequency || 'weekly';
        const priority = url.priority || '0.8';

        return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

async function fetchCategories(wordpressApiUrl) {
    try {
        const response = await fetch(
            `${wordpressApiUrl}/categories?per_page=100`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                // Always fetch fresh data - no caching
                cache: 'no-store'
            }
        );

        if (response.ok) {
            const wpCategories = await response.json();
            if (Array.isArray(wpCategories)) {
                return wpCategories
                    .filter(cat => cat.slug !== 'uncategorized' && cat.name !== 'Uncategorized')
                    .map(cat => ({
                        url: `${getBaseUrl()}/${cat.slug}`,
                        lastModified: new Date(cat.modified || cat.date),
                        changeFrequency: 'weekly',
                        priority: 0.8,
                    }));
            }
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
    return [];
}

async function fetchBlogPosts(wordpressApiUrl, baseUrl) {
    try {
        // Fetch all pages of posts
        let allPosts = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const response = await fetch(
                `${wordpressApiUrl}/posts?status=publish&per_page=100&page=${page}&_embed=true`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // Always fetch fresh data - no caching
                    cache: 'no-store'
                }
            );

            if (response.ok) {
                const posts = await response.json();
                if (Array.isArray(posts) && posts.length > 0) {
                    allPosts.push(...posts);
                    page++;

                    // Check if there are more pages
                    const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1');
                    if (page > totalPages || posts.length < 100) {
                        hasMore = false;
                    }
                } else {
                    hasMore = false;
                }
            } else {
                hasMore = false;
            }
        }

        if (Array.isArray(allPosts)) {
            return allPosts.map((post) => {
                // Get category slug from embedded data
                const postCategories = post._embedded?.['wp:term']?.[0] || [];
                const primaryCategory = postCategories[0];
                const categorySlug = primaryCategory?.slug || 'uncategorized';

                return {
                    url: `${baseUrl}/${categorySlug}/${post.slug}`,
                    lastModified: new Date(post.modified || post.date),
                    changeFrequency: 'weekly',
                    priority: 0.9,
                };
            });
        }
    } catch (error) {
        console.error('Error fetching blog posts:', error);
    }
    return [];
}

export async function GET() {
    const baseUrl = getBaseUrl();
    const wordpressApiUrl = getWordPressApiUrl();

    // Static pages - always include these
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/write-your-blog`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact-us`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/lets-work-together`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];

    // Fetch categories and blog posts in parallel
    const [categories, blogPosts] = await Promise.all([
        fetchCategories(wordpressApiUrl),
        fetchBlogPosts(wordpressApiUrl, baseUrl),
    ]);

    // Combine all URLs
    const allUrls = [...staticPages, ...categories, ...blogPosts];

    // Generate XML
    const xmlContent = generateSitemapXml(allUrls);

    // Return XML response with minimal caching to ensure fresh data
    return new Response(xmlContent, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
    });
}

