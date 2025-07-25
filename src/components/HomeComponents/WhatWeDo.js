'use client';
import Link from 'next/link';
import React from 'react';
import {
    FaSearch,
    FaGoogle,
    FaCode,
    FaServer,
    FaNetworkWired,
    FaWordpress
} from 'react-icons/fa';

const services = [
    {
        title: 'SEO (Search Engine Optimization)',
        icon: <FaSearch className="text-3xl text-purple-500" />,
        desc: 'Drive organic growth through technical SEO, content strategy, and search visibility optimization.',
    },
    {
        title: 'SEM (Search Engine Marketing)',
        icon: <FaGoogle className="text-3xl text-pink-500" />,
        desc: 'Launch high-converting ad campaigns across Google Ads and social platforms to boost your reach.',
    },
    {
        title: 'React / Next.js Development',
        icon: <FaCode className="text-3xl text-yellow-500" />,
        desc: 'Build fast, SEO-optimized SPAs and websites using React 18+ and Next.js 13+.',
    },
    {
        title: 'MERN Stack Development',
        icon: <FaCode className="text-3xl text-blue-600" />,
        desc: 'End-to-end web apps using MongoDB, Express.js, React, and Node.js with JWT and secure APIs.',
    },
    {
        title: 'REST API & JWT Integration',
        icon: <FaNetworkWired className="text-3xl text-green-600" />,
        desc: 'Design and integrate scalable, secure APIs for web, mobile, and 3rd-party integrations.',
    },
    {
        title: 'DevOps & Server Management',
        icon: <FaServer className="text-3xl text-indigo-600" />,
        desc: 'Efficient deployment using Nginx, PM2, CI/CD, and cloud platforms like AWS, Azure & DigitalOcean.',
    },
    {
        title: 'WordPress & Elementor Pro',
        icon: <FaWordpress className="text-3xl text-sky-500" />,
        desc: 'Custom WordPress sites with Elementor, ACF, CPT, dynamic content, and fast performance.',
    },
    {
        title: 'PHP & Laravel Development',
        icon: <FaCode className="text-3xl text-rose-500" />,
        desc: 'Develop powerful web applications using core PHP or modern Laravel frameworks.',
    },
    {
        title: 'Enterprise CMS – Sitecore XP',
        icon: <FaCode className="text-3xl text-orange-500" />,
        desc: 'Build, customize, and manage enterprise-level digital experiences using Sitecore 10 XP.',
    },
];

const WhatWeDo = () => {
    return (
        <section className="bg-[#14202E] py-20 px-4 text-white">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 drop-shadow-md">
                    What We Do
                </h2>
                <p className="max-w-2xl mx-auto text-gray-300 text-lg mb-12">
                    We combine creativity and technology to deliver full-stack solutions, digital marketing, and scalable infrastructure.
                </p>

                <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-[#1F2A3C] rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300 hover:scale-[1.02] flex flex-col items-center text-center"
                        >
                            {service.icon}
                            <h3 className="text-xl font-semibold mt-4 mb-2">{service.title}</h3>
                            <p className="text-gray-400 text-sm">{service.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12">
                    <Link
                        href="/lets-work-together"
                        className="inline-block bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-black font-semibold py-3 px-6 rounded-xl shadow-md hover:scale-105 transition-transform"
                    >
                        Let’s Work Together
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default WhatWeDo;
