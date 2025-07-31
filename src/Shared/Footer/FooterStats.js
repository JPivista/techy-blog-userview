import React from 'react';
import {
    FaUsers,
    FaGlobe,
    FaHeart,
    FaBookOpen
} from 'react-icons/fa';

const FooterStats = () => {
    const stats = [
        { number: "500+", label: "Active Writers", icon: <FaUsers className="text-2xl text-blue-400" /> },
        { number: "50K+", label: "Monthly Readers", icon: <FaGlobe className="text-2xl text-green-400" /> },
        { number: "1000+", label: "Published Articles", icon: <FaBookOpen className="text-2xl text-purple-400" /> },
        { number: "95%", label: "Satisfaction Rate", icon: <FaHeart className="text-2xl text-red-400" /> }
    ];

    return (
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 leading-tight">
                Our Growing Community
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed px-4">
                Join thousands of writers who are already making an impact and building their authority in the digital world.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {stats.map((stat, index) => (
                    <div key={index} className="text-center p-2">
                        <div className="flex justify-center mb-3">
                            {stat.icon}
                        </div>
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                            {stat.number}
                        </div>
                        <div className="text-gray-300 text-xs md:text-sm lg:text-base leading-tight">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FooterStats; 