'use client';
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";

const CategoryCard = ({ name, href, icon, index }) => {
    const cardRef = useRef();

    useEffect(() => {
        gsap.fromTo(
            cardRef.current,
            {
                opacity: 0,
                y: 50,
                rotateX: 15,
                scale: 0.9
            },
            {
                opacity: 1,
                y: 0,
                rotateX: 0,
                scale: 1,
                duration: 1,
                ease: "power3.out",
                delay: index * 0.15 // stagger effect
            }
        );
    }, [index]);

    const handleMouseEnter = () => {
        gsap.to(cardRef.current, {
            scale: 1.06,
            boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.2)",
            duration: 0.3,
            ease: "power2.out"
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            scale: 1,
            boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)",
            duration: 0.3,
            ease: "power2.inOut"
        });
    };

    return (
        <Link href={href}>
            <div
                ref={cardRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="glass rounded-3xl shadow-xl p-10 flex flex-col items-center border-t-4 border-purple-200 transition-transform"
            >
                <span className="text-5xl mb-4">{icon}</span>
                <h3 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400">
                    {name}
                </h3>
                <p className="text-gray-600 text-center font-bold">
                    Explore the latest in {name.toLowerCase()}.
                </p>
            </div>
        </Link>
    );
};

export default CategoryCard;
