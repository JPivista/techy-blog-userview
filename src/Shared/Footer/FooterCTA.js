import React from 'react';
import Link from 'next/link';
import { FaHandshake, FaRocket, FaStar } from 'react-icons/fa';
import BurstButton from '../BurstButton';

const FooterCTA = () => {
    return (
        <div className="text-center bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-yellow-600/20 rounded-2xl p-12 border border-white/20">
            <div className="flex justify-center mb-6">
                <FaHandshake className="text-4xl text-yellow-400" />
            </div>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                Ready to Start Your Writing Journey?
            </h3>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed px-4">
                Join our community of passionate writers and start sharing your knowledge with the world today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <BurstButton />
                {/* <Link
                    href="/contact-us"
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                    Learn More
                </Link> */}
            </div>
        </div>
    );
};

export default FooterCTA; 