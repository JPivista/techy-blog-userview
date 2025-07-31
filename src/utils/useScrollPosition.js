import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export const useScrollPosition = () => {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Handle scroll visibility for the scroll-to-top button
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Always scroll to top when pathname changes
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Add scroll event listener
        window.addEventListener('scroll', toggleVisibility);

        // Cleanup
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, [pathname]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return { isVisible, scrollToTop };
}; 