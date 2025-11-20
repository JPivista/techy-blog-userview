export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_FULL_DOMAIN || 'https://techy-blog.com';
    
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/verify-email',
                    '/blog-submission-success',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/api/',
                    '/verify-email',
                    '/blog-submission-success',
                ],
            },
            {
                userAgent: 'Bingbot',
                allow: '/',
                disallow: [
                    '/api/',
                    '/verify-email',
                    '/blog-submission-success',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

