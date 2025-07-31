'use client'
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';

const LatestBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs`);
                if (!response.ok) throw new Error('Failed to fetch blogs');

                const data = await response.json();
                const publishedBlogs = data.blogs?.filter(blog => blog.status === "published").slice(0, 10) || [];
                setBlogs(publishedBlogs);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (isLoading) return <div className="text-center text-lg mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">Error: {error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 relative">
            <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent mb-12">
                Latest Blog Posts
            </h2>

            {blogs.length === 0 ? (
                <p className="text-center text-gray-500">No published blogs available.</p>
            ) : (
                <>
                    <Swiper
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={true}
                        navigation={{
                            nextEl: '.custom-next',
                            prevEl: '.custom-prev',
                        }}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000 }}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        modules={
                            [
                                Navigation,
                                // Pagination,
                                Autoplay
                            ]
                        }
                    >
                        {blogs.map((blog) => (
                            <SwiperSlide key={blog._id} className="p-3">
                                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition h-full flex flex-col">
                                    {/* Image or fallback */}
                                    {blog.image ? (
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 shadow-lg animate-pulse">
                                            <span className="drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                                                {blog.category}
                                            </span>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="text-lg font-semibold text-blue-700 mb-2 line-clamp-2 min-h-[3.5rem]">
                                            {blog.title}
                                        </h3>
                                        <div
                                            className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[4.5rem]"
                                            dangerouslySetInnerHTML={{ __html: blog.description }}
                                        />

                                        <div className="mt-auto">
                                            <div className="text-sm text-gray-400 mb-2 flex justify-between">
                                                <span>{blog?.publishedDate ? new Date(blog.publishedDate).toLocaleDateString() : 'No Date'}</span>
                                                <span className="text-purple-600 font-medium">
                                                    By: {blog?.authorName || 'Unknown'}
                                                </span>
                                            </div>
                                            <Link
                                                href={`/${blog.categoryIds?.[0]?.name?.toLowerCase() || 'blog'}/${blog.slug}`}
                                                className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition"
                                            >
                                                Read More →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Arrows */}
                    <div className="custom-prev absolute top-1/2 -left-5 transform -translate-y-1/2 cursor-pointer z-10">
                        <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow hover:bg-purple-800 transition">
                            &#8592;
                        </div>
                    </div>
                    <div className="custom-next absolute top-1/2 -right-5 transform -translate-y-1/2 cursor-pointer z-10">
                        <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow hover:bg-purple-800 transition">
                            &#8594;
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default LatestBlogs;
