// import Image from "next/image";
import HomeComponents from '../components/HomeComponents/index'
import Script from 'next/script';

export const metadata = {
  title: "TechyBlog - Publish Your Tech Expertise & Build Your Authority | Expert Tech Blogging Platform",
  description: "Transform your technical knowledge into powerful content. Join TechyBlog's elite community of tech writers, publish expert articles, establish thought leadership, and reach millions of readers worldwide. Start writing today and amplify your voice in the tech industry.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_FULL_DOMAIN || 'https://techy-blog.com',
  },
};

export default function Home() {
  const fullDomain = process.env.NEXT_PUBLIC_FULL_DOMAIN || 'https://techy-blog.com';

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TechyBlog",
    "url": fullDomain,
    "logo": `${fullDomain}/favicon.png`,
    "description": "Join our community of passionate writers and start sharing your knowledge with the world.",
    "sameAs": []
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TechyBlog",
    "url": fullDomain,
    "description": "Share your knowledge with the world. Write blogs, build authority, and connect with readers worldwide.",
    "sitemap": `${fullDomain}/sitemap.xml`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${fullDomain}/?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HomeComponents />
    </>
  );
}
