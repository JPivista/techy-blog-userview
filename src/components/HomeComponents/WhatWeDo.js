import React from 'react';
import { FaSearch, FaGoogle, FaCode, FaServer, FaNetworkWired } from 'react-icons/fa';

const services = [
    {
        title: 'SEO',
        icon: <FaSearch className="text-3xl text-purple-500" />,
        desc: 'Improve your search visibility and organic traffic with our expert SEO strategies.',
    },
    {
        title: 'SEM',
        icon: <FaGoogle className="text-3xl text-pink-500" />,
        desc: 'Run targeted ad campaigns to boost your reach and conversions on Google & social platforms.',
    },
    {
        title: 'React / Next.js',
        icon: <FaCode className="text-3xl text-yellow-500" />,
        desc: 'We build fast, modern, and SEO-friendly web apps using React and Next.js.',
    },
    {
        title: 'MERN Stack',
        icon: <FaCode className="text-3xl text-blue-600" />,
        desc: 'Full-stack JavaScript solutions using MongoDB, Express, React, and Node.js.',
    },
    {
        title: 'REST API Integration',
        icon: <FaNetworkWired className="text-3xl text-green-600" />,
        desc: 'Secure, scalable APIs to power your frontend or mobile apps.',
    },
    {
        title: 'Server Handling / DevOps',
        icon: <FaServer className="text-3xl text-indigo-600" />,
        desc: 'From Nginx to CI/CD, we manage deployment and infrastructure efficiently.',
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
                    We offer tailored solutions to grow your digital presence and develop scalable web apps.
                </p>

                <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
                    {services.map((service, i) => (
                        <div
                            key={i}
                            className="bg-[#1F2A3C] rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300 hover:scale-[1.02] flex flex-col items-center text-center"
                        >
                            {service.icon}
                            <h3 className="text-xl font-semibold mt-4 mb-2">{service.title}</h3>
                            <p className="text-gray-400 text-sm">{service.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhatWeDo;
