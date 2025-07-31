// app/components/ScrollToTop.js
"use client";

import { FaArrowUp } from "react-icons/fa";
import { useScrollPosition } from "../utils/useScrollPosition";

const ScrollToTop = () => {
    const { isVisible, scrollToTop } = useScrollPosition();

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-bounce"
                    aria-label="Scroll to top"
                >
                    {/* <FaArrowUp className="text-lg" /> */}
                </button>
            )}
        </>
    );
};

export default ScrollToTop;
