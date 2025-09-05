/**
 * Get the appropriate image URL for a blog
 * Priority: banner (desktop) -> thumbnail (tablet) -> mobileBanner (mobile)
 * @param {Object} blog - Blog object with image fields
 * @returns {string|null} - Full image URL or null if no images
 */
export function getBlogImageUrl(blog) {
    if (!blog) return null;

    // Use the current website domain, not the API domain
    const isDevelopment = process.env.NODE_ENV === 'development';
    let baseUrl;

    if (isDevelopment) {
        // For development, use localhost:3000 (frontend domain)
        baseUrl = 'http://localhost:3000';
    } else {
        // For production, use the current website domain
        baseUrl = 'https://www.techy-blog.com';
    }

    console.log('getBlogImageUrl - baseUrl:', baseUrl);
    console.log('getBlogImageUrl - blog:', blog);

    // Helper function to construct URL
    const constructUrl = (imagePath) => {
        if (!imagePath) return null;
        // If it's already a full URL, return as is
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        // If it starts with /uploads, construct full URL (remove /api if present)
        if (imagePath.startsWith('/uploads')) {
            return `${baseUrl}${imagePath}`;
        }
        // If it doesn't start with /, add it
        if (!imagePath.startsWith('/')) {
            return `${baseUrl}/uploads/${imagePath}`;
        }
        // Default case
        return `${baseUrl}${imagePath}`;
    };

    // Priority: banner (desktop) -> thumbnail (tablet) -> mobileBanner (mobile)
    if (blog.banner) {
        const url = constructUrl(blog.banner);
        console.log('getBlogImageUrl - banner URL:', url);
        return url;
    }

    if (blog.thumbnail) {
        const url = constructUrl(blog.thumbnail);
        console.log('getBlogImageUrl - thumbnail URL:', url);
        return url;
    }

    if (blog.mobileBanner) {
        const url = constructUrl(blog.mobileBanner);
        console.log('getBlogImageUrl - mobileBanner URL:', url);
        return url;
    }

    console.log('getBlogImageUrl - no images found');
    return null;
}

/**
 * Get the banner image URL for a blog (for full blog view)
 * @param {Object} blog - Blog object with image fields
 * @returns {string|null} - Full banner URL or null if no banner
 */
export function getBlogBannerUrl(blog) {
    if (!blog || !blog.banner) return null;

    // Use the current website domain, not the API domain
    const isDevelopment = process.env.NODE_ENV === 'development';
    let baseUrl;

    if (isDevelopment) {
        // For development, use localhost:3000 (frontend domain)
        baseUrl = 'http://localhost:3000';
    } else {
        // For production, use the current website domain
        baseUrl = 'https://www.techy-blog.com';
    }

    // Helper function to construct URL
    const constructUrl = (imagePath) => {
        if (!imagePath) return null;
        // If it's already a full URL, return as is
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        // If it starts with /uploads, construct full URL (remove /api if present)
        if (imagePath.startsWith('/uploads')) {
            return `${baseUrl}${imagePath}`;
        }
        // If it doesn't start with /, add it
        if (!imagePath.startsWith('/')) {
            return `${baseUrl}/uploads/${imagePath}`;
        }
        // Default case
        return `${baseUrl}${imagePath}`;
    };

    return constructUrl(blog.banner);
}
