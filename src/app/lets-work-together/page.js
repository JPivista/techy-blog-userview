import LetsWorkTogether from '../../utils/LetsWorkTogether'
import React from 'react'
import Script from 'next/script';

export const metadata = {
  title: "Let's Work Together - TechyBlog",
  description: "Interested in collaborating with TechyBlog? Let's work together to create amazing content and reach a wider audience.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_FULL_DOMAIN || 'https://techy-blog.com'}/lets-work-together`,
  },
};

const page = () => {
    const fullDomain = process.env.NEXT_PUBLIC_FULL_DOMAIN || 'https://techy-blog.com';
    
    const collaborationPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Let's Work Together - TechyBlog",
        "url": `${fullDomain}/lets-work-together`,
        "description": "Interested in collaborating with TechyBlog? Let's work together to create amazing content and reach a wider audience.",
        "mainEntity": {
            "@type": "Service",
            "name": "Collaboration Service",
            "provider": {
                "@type": "Organization",
                "name": "TechyBlog",
                "url": fullDomain
            }
        }
    };

    return (
        <>
            <Script
                id="collaboration-page-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collaborationPageSchema) }}
            />
            <LetsWorkTogether />
        </>
    )
}

export default page
