import React from 'react';
import {
    FaTrophy,
    FaRocket,
    FaLightbulb,
    FaChartLine,
    FaAward,
    FaGraduationCap
} from 'react-icons/fa';

const FooterFeatures = () => {
    const features = [
        {
            icon: <FaTrophy className="text-3xl text-yellow-400" />,
            title: "Build Your Authority",
            description: "Establish yourself as an expert in your field and gain recognition in your industry."
        },
        {
            icon: <FaRocket className="text-3xl text-blue-400" />,
            title: "Reach Global Audience",
            description: "Connect with readers worldwide and expand your influence across borders."
        },
        {
            icon: <FaLightbulb className="text-3xl text-yellow-400" />,
            title: "Share Your Knowledge",
            description: "Inspire others with your insights and contribute to the global knowledge base."
        },
        {
            icon: <FaChartLine className="text-3xl text-green-400" />,
            title: "Grow Your Network",
            description: "Connect with like-minded professionals and expand your professional network."
        },
        {
            icon: <FaAward className="text-3xl text-purple-400" />,
            title: "Get Recognized",
            description: "Earn recognition for your expertise and build a strong personal brand."
        },
        {
            icon: <FaGraduationCap className="text-3xl text-indigo-400" />,
            title: "Learn & Grow",
            description: "Continuous learning through feedback and collaboration with other writers."
        }
    ];

    return (
        <div className="mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white leading-tight">
                Why Choose TechyBlog?
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 md:p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                        <div className="flex justify-center mb-4">
                            {feature.icon}
                        </div>
                        <h4 className="text-lg md:text-xl font-semibold text-white mb-3 text-center leading-tight">
                            {feature.title}
                        </h4>
                        <p className="text-gray-300 text-center leading-relaxed text-sm md:text-base">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FooterFeatures; 