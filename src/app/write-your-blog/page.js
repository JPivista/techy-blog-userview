import WriteYourBlog from '../../components/HomeComponents/WriteYourBlog';
import Script from 'next/script';

export const metadata = {
  title: "Write Your Blog - TechyBlog",
  description: "Share your knowledge with the world. Submit your blog post to TechyBlog and reach thousands of readers. Free to submit, professional editing support included.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_FULL_DOMAIN || 'https://techy-blog.com'}/write-your-blog`,
  },
};

export default function CreateBlogPage() {
    const fullDomain = process.env.NEXT_PUBLIC_FULL_DOMAIN || 'https://techy-blog.com';
    
    const writeBlogPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Write Your Blog - TechyBlog",
        "url": `${fullDomain}/write-your-blog`,
        "description": "Share your knowledge with the world. Submit your blog post to TechyBlog and reach thousands of readers.",
        "mainEntity": {
            "@type": "Service",
            "name": "Blog Submission Service",
            "provider": {
                "@type": "Organization",
                "name": "TechyBlog",
                "url": fullDomain
            },
            "description": "Submit your blog post to TechyBlog. Free to submit, professional editing support included."
        }
    };

    return (
        <div className="min-h-screen">
            <Script
                id="write-blog-page-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(writeBlogPageSchema) }}
            />
            <WriteYourBlog />
        </div>
    );
} 