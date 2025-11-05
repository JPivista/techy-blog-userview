/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/uploads/:path*',
                destination: process.env.NODE_ENV === 'development'
                    ? 'http://localhost:7010/uploads/:path*'
                    : 'https://api.techy-blog.com/uploads/:path*'
            }
        ];
    },
    images: {
        domains: [
            'localhost',
            'api.techy-blog.com',
            'www.techy-blog.com',
            'techy-blog.com'
        ],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '7010',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'api.techy-blog.com',
                pathname: '/uploads/**',
            }
        ]
    }
};

module.exports = nextConfig;
