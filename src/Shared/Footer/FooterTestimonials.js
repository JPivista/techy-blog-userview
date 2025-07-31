import React from 'react';
import { FaStar } from 'react-icons/fa';

const FooterTestimonials = () => {
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Tech Blogger",
            content: "Writing for TechyBlog has transformed my career. I've connected with amazing readers and built a strong personal brand.",
            rating: 5
        },
        {
            name: "Michael Chen",
            role: "Business Consultant",
            content: "The platform is incredibly user-friendly and the community is supportive. Highly recommended for any writer!",
            rating: 5
        },
        {
            name: "Emily Rodriguez",
            role: "Marketing Expert",
            content: "I've gained thousands of new followers and clients through my articles here. It's been a game-changer!",
            rating: 5
        }
    ];

    return (
        <div className="mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white leading-tight">
                What Our Writers Say
            </h3>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 md:p-6">
                        <div className="flex mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                                <FaStar key={i} className="text-yellow-400 text-lg" />
                            ))}
                        </div>
                        <p className="text-gray-300 mb-4 italic">
                            "{testimonial.content}"
                        </p>
                        <div className="text-center">
                            <div className="font-semibold text-white">
                                {testimonial.name}
                            </div>
                            <div className="text-gray-400 text-sm">
                                {testimonial.role}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FooterTestimonials; 