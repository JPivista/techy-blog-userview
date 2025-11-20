const fs = require('fs');
const path = require('path');

// Get base URL from environment variable or use default
const isDevelopment = process.env.NODE_ENV === 'development';
const baseUrl = isDevelopment
    ? (process.env.NEXT_PUBLIC_FULL_DOMAIN || 'http://localhost:3000')
    : (process.env.NEXT_PUBLIC_FULL_DOMAIN || 'https://techy-blog.com');

// Get WordPress API URL from environment variable or use default
const wordpressApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://docs.techy-blog.com/wp-json/wp/v2';

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

async function generateSitemap() {
    console.log('🚀 Generating sitemap...');

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

    let categories = [];
    let blogPosts = [];

    // Fetch all categories from WordPress
    try {
        console.log('📂 Fetching categories from WordPress...');
        const categoriesResponse = await fetch(
            `${wordpressApiUrl}/categories?per_page=100`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (categoriesResponse.ok) {
            const wpCategories = await categoriesResponse.json();
            if (Array.isArray(wpCategories)) {
                categories = wpCategories
                    .filter(cat => cat.slug !== 'uncategorized' && cat.name !== 'Uncategorized')
                    .map(cat => ({
                        url: `${baseUrl}/${cat.slug}`,
                        lastModified: new Date(cat.modified || cat.date),
                        changeFrequency: 'weekly',
                        priority: 0.8,
                    }));
                console.log(`✅ Found ${categories.length} categories`);
            }
        }
    } catch (error) {
        console.warn('⚠️  Error fetching categories:', error.message);
    }

    // Fetch all blog posts from WordPress
    try {
        console.log('📝 Fetching blog posts from WordPress...');

        // Fetch all pages of posts
        let allPosts = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const postsResponse = await fetch(
                `${wordpressApiUrl}/posts?status=publish&per_page=100&page=${page}&_embed=true`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (postsResponse.ok) {
                const posts = await postsResponse.json();
                if (Array.isArray(posts) && posts.length > 0) {
                    allPosts.push(...posts);
                    page++;

                    // Check if there are more pages
                    const totalPages = parseInt(postsResponse.headers.get('x-wp-totalpages') || '1');
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
            blogPosts = allPosts.map((post) => {
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
            console.log(`✅ Found ${blogPosts.length} blog posts`);
        }
    } catch (error) {
        console.warn('⚠️  Error fetching blog posts:', error.message);
    }

    // Combine all URLs
    const allUrls = [...staticPages, ...categories, ...blogPosts];

    console.log(`📊 Total URLs: ${allUrls.length} (${staticPages.length} static, ${categories.length} categories, ${blogPosts.length} posts)`);

    // Generate XML
    const xmlContent = generateSitemapXml(allUrls);

    // Write to public/sitemap.xml
    const publicDir = path.join(process.cwd(), 'public');
    const sitemapPath = path.join(publicDir, 'sitemap.xml');

    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(sitemapPath, xmlContent, 'utf8');
    console.log(`✅ Sitemap generated successfully at: ${sitemapPath}`);
    console.log(`🌐 Sitemap will be available at: ${baseUrl}/sitemap.xml`);
}

// Run the script
generateSitemap().catch(error => {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
});

