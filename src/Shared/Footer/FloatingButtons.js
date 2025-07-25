'use client';
import React, { useEffect, useState } from "react";
import { FaWhatsapp, FaArrowUp } from "react-icons/fa";

const FloatingButtons = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const name = "JP"; // You can replace this dynamically later if needed

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const pageHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / pageHeight) * 100;
            setShowScrollTop(scrollPercent > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const encodedMessage = encodeURIComponent(`Hi, this is ${name}. I want to enquire.`);
    const whatsappLink = `https://wa.me/916381160145?text=${encodedMessage}`;

    return (
        <>
            {/* WhatsApp Floating Button */}
            <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition duration-300"
                aria-label="Chat on WhatsApp"
            >
                <FaWhatsapp size={22} />
            </a>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-20 right-6 z-50 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition duration-300"
                    aria-label="Scroll to top"
                >
                    <FaArrowUp size={18} />
                </button>
            )}
        </>
    );
};

export default FloatingButtons;
