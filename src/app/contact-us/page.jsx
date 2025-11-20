import ContactForm from '../../utils/ContactForm'
import React from 'react'
import Script from 'next/script';

export const metadata = {
    title: "Contact Us - TechyBlog",
    description: "Get in touch with TechyBlog. Have questions, suggestions, or want to collaborate? We'd love to hear from you.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_FULL_DOMAIN || 'https://techy-blog.com'}/contact-us`,
    },
};

const page = () => {
    const fullDomain = process.env.NEXT_PUBLIC_FULL_DOMAIN || 'https://techy-blog.com';

    const contactPageSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Us - TechyBlog",
        "url": `${fullDomain}/contact-us`,
        "description": "Get in touch with TechyBlog. Have questions, suggestions, or want to collaborate? We'd love to hear from you.",
        "mainEntity": {
            "@type": "Organization",
            "name": "TechyBlog",
            "url": fullDomain
        }
    };

    return (
        <>
            <Script
                id="contact-page-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
            />
            <ContactForm />
        </>
    )
}

export default page
